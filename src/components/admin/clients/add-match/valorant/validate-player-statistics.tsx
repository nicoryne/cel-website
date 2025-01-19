'use client';

import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { preprocessImageAndExtractRows } from '@/components/admin/clients/add-match/valorant/utils';

type ValidatePlayerStatisticsProps = {
  imageData: React.MutableRefObject<string | undefined>;
};

type RowData = {
  image: string;
  text: string;
};

export default function ValidatePlayerStatistics({ imageData }: ValidatePlayerStatisticsProps) {
  const [rowsData, setRowsData] = useState<RowData[]>([]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    console.log(rowsData);
  }, [rowsData]);

  useEffect(() => {
    if (imageData.current) {
      const processImageData = async () => {
        try {
          const { rowsData, processedImageUrl } = await processImage(imageData.current!);
          setRowsData(rowsData);
          setProcessedImage(processedImageUrl);
          setError(null);
        } catch (err) {
          setError('Failed to extract text from image. Please try again.');
          console.error(err);
        }
      };

      processImageData();
    }
  }, [imageData]);

  const processRows = async (rowDataUrls: string[][]) => {
    const results: RowData[] = [];
    const totalCells = rowDataUrls.flat().length;
    let processedCells = 0;

    for (const rowDataUrl of rowDataUrls) {
      const rowResult: RowData[] = [];
      for (const cellDataUrl of rowDataUrl) {
        const {
          data: { text }
        } = await Tesseract.recognize(cellDataUrl, 'eng', {
          logger: (info) => {
            if (info.status === 'recognizing text') {
              // Update progress based on individual cell progress
              const cellProgress = info.progress / totalCells;
              setProgress((prevProgress) => Math.min(100, prevProgress + Math.round(cellProgress * 100)));
            }
          }
        });
        rowResult.push({ image: cellDataUrl, text });

        processedCells += 1;
        setProgress(Math.round((processedCells / totalCells) * 100));
      }
      results.push(...rowResult); // Flatten the nested results
    }
    return results;
  };

  const processImage = async (imagePath: string) => {
    try {
      const { rowDataUrls, processedImageUrl } = await preprocessImageAndExtractRows(imagePath);
      const rowResults = await processRows(rowDataUrls);
      return { rowsData: rowResults, processedImageUrl };
    } catch (err) {
      console.error('Error processing image:', err);
      throw err;
    }
  };

  return (
    <div className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 p-4 text-neutral-600">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {processedImage && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-200">Processed Image</h2>
              <img src={processedImage} alt="Processed Image" className="w-full rounded-md border border-neutral-700" />
            </div>
          )}
          {rowsData.length > 0 ? (
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-neutral-200">Extracted Player Statistics</h2>
              <div className="mt-4 grid grid-cols-9 gap-4">
                {rowsData.map((row, index) => (
                  <div key={index} className="flex flex-col items-start space-x-4">
                    <img src={row.image} alt={`Row ${index + 1}`} className="rounded-md border border-neutral-700" />
                    <pre className="whitespace-pre-wrap text-neutral-400">{row.text}</pre>
                  </div>
                ))}
              </div>
              <div></div>
            </div>
          ) : (
            <p>Processing... {progress > 0 && `${progress}%`}</p>
          )}
        </div>
      )}
    </div>
  );
}
