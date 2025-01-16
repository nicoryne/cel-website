'use client';

import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import cv from '@techstark/opencv-js';

type ValidatePlayerStatisticsProps = {
  imageData: React.MutableRefObject<string | undefined>;
};

export default function ValidatePlayerStatistics({ imageData }: ValidatePlayerStatisticsProps) {
  const [extractedText, setExtractedText] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (imageData.current) {
      const processImage = async () => {
        try {
          const processedImage = await preprocessImage(imageData.current!);

          const {
            data: { text }
          } = await Tesseract.recognize(processedImage, 'eng', {
            logger: (info) => {
              if (info.status === 'recognizing text') {
                setProgress(Math.round(info.progress * 100));
              }
            }
          });

          setExtractedText(text);
          setError(null);
        } catch (err) {
          setError('Failed to extract text from image. Please try again.');
          console.error(err);
        }
      };

      processImage();
    }
  }, [imageData]);

  const preprocessImage = async (imagePath: string) => {
    return new Promise<string>((resolve, reject) => {
      const imgElement = document.createElement('img');
      imgElement.src = imagePath;

      imgElement.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = imgElement.width;
          canvas.height = imgElement.height;

          if (ctx) {
            ctx.drawImage(imgElement, 0, 0);

            const src = cv.imread(canvas);

            cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);

            cv.GaussianBlur(src, src, new cv.Size(5, 5), 0);

            cv.adaptiveThreshold(src, src, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

            const kernel = cv.Mat.eye(3, 3, cv.CV_32F);
            kernel.data32F[4] = 5.0;
            kernel.data32F[1] = kernel.data32F[3] = kernel.data32F[5] = kernel.data32F[7] = -1.0;
            cv.filter2D(src, src, cv.CV_8U, kernel);

            cv.imshow(canvas, src);
            const processedDataUrl = canvas.toDataURL();

            src.delete();

            resolve(processedDataUrl);
          } else {
            reject(new Error('Failed to get 2D context from canvas.'));
          }
        } catch (err) {
          reject(err);
        }
      };

      imgElement.onerror = (err) => {
        reject(new Error('Failed to load the image for preprocessing.'));
      };
    });
  };

  return (
    <div className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 p-4 text-neutral-600">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : extractedText ? (
        <div>
          <h2 className="text-lg font-semibold text-neutral-200">Extracted Player Statistics</h2>
          <pre className="mt-4 whitespace-pre-wrap text-neutral-400">{extractedText}</pre>
        </div>
      ) : (
        <p>Processing... {progress > 0 && `${progress}%`}</p>
      )}
    </div>
  );
}
