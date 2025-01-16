'use client';
import React from 'react';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import not_found from '@/../../public/images/not-found.webp';

type UploadPlayerStatisticsProps = {
  imageData: React.MutableRefObject<string | undefined>;
};

export default function UploadPlayerStatistics({ imageData }: UploadPlayerStatisticsProps) {
  const [selectedImagePreview, setSelectedImagePreview] = React.useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      const imageURL = URL.createObjectURL(files[0]);
      imageData.current = imageURL;
      setSelectedImagePreview(imageURL);
    }
  };

  React.useEffect(() => {
    if (imageData.current) {
      setSelectedImagePreview(imageData.current!);
    }
  }, [imageData]);
  return (
    <>
      <div className="w-full rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
        <label
          htmlFor="file-upload"
          className="flex cursor-pointer flex-col gap-4 text-center text-neutral-600 duration-150 ease-linear hover:text-neutral-200"
        >
          {selectedImagePreview ? (
            <Image
              src={selectedImagePreview}
              alt={`Valorant Match Record Picture`}
              className="object-cover"
              width={1920}
              height={1080}
            />
          ) : (
            <div>
              <ArrowUpOnSquareIcon className="mx-auto h-auto w-24" />
              <span>Upload Match Results</span>
            </div>
          )}
        </label>
        <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
    </>
  );
}
