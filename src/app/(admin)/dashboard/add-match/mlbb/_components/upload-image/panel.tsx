'use client';
import React from 'react';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

type UploadPlayerStatisticsProps = {
  equipmentImageData: React.MutableRefObject<string | undefined>;
  dataImageData: React.MutableRefObject<string | undefined>;
};

export default function UploadPlayerStatisticsPanel({
  equipmentImageData,
  dataImageData
}: UploadPlayerStatisticsProps) {
  const [equipmentImagePreview, setEquipmentImagePreview] = React.useState('');
  const [dataImagePreview, setDataImagePreview] = React.useState('');

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'equipment' | 'data'
  ) => {
    const files = event.target.files;

    if (files && files[0]) {
      const imageURL = URL.createObjectURL(files[0]);

      if (type === 'equipment') {
        equipmentImageData.current = imageURL;
        setEquipmentImagePreview(imageURL);
      } else {
        dataImageData.current = imageURL;
        setDataImagePreview(imageURL);
      }
    }
  };

  React.useEffect(() => {
    if (equipmentImageData.current) {
      setEquipmentImagePreview(equipmentImageData.current);
    }

    if (dataImageData.current) {
      setDataImagePreview(dataImageData.current);
    }
  }, [equipmentImageData, dataImageData]);
  return (
    <>
      <div className="flex">
        <div className="h-full w-full items-center justify-center">
          <label
            htmlFor="equipment-upload"
            className="relative h-full w-full cursor-pointer flex-col gap-4 text-center text-neutral-600 duration-150 ease-linear hover:text-neutral-200 hover:opacity-40"
          >
            {equipmentImagePreview ? (
              <Image
                src={equipmentImagePreview}
                alt={`MLBB Equipment Data Picture`}
                width={1920}
                height={1080}
                className="scale-90"
              />
            ) : (
              <div className="py-32">
                <ArrowUpOnSquareIcon className="mx-auto h-auto w-24" />
                <span>Upload Equipment Data Image</span>
              </div>
            )}
          </label>
          <input
            id="equipment-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, 'equipment')}
          />
        </div>
        <div className="h-full w-full items-center justify-center">
          <label
            htmlFor="data-upload"
            className="relative h-full w-full cursor-pointer flex-col gap-4 text-center text-neutral-600 duration-150 ease-linear hover:text-neutral-200 hover:opacity-40"
          >
            {dataImagePreview ? (
              <Image
                src={dataImagePreview}
                alt={`MLBB Data Data Picture`}
                width={1920}
                height={1080}
                className="scale-90"
              />
            ) : (
              <div className="py-32">
                <ArrowUpOnSquareIcon className="mx-auto h-auto w-24" />
                <span>Upload Data Image</span>
              </div>
            )}
          </label>
          <input
            id="data-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, 'data')}
          />
        </div>
      </div>
    </>
  );
}
