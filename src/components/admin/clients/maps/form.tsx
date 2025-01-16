'use client';
import React from 'react';
import Image from 'next/image';
import { ValorantMap, ValorantMapFormType } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';

type MapsFormProps = {
  formData: React.MutableRefObject<ValorantMapFormType | undefined>;
  map: ValorantMap | null;
};

export default function MapsForm({ formData, map }: MapsFormProps) {
  const [mapInfo, setMapInfo] = React.useState<ValorantMapFormType>({
    name: map?.name || '',
    is_active: map?.is_active || false,
    splash_image: null
  });

  const updateMapInfo = (field: keyof ValorantMapFormType, value: string | boolean | File) => {
    setMapInfo((mapInfo) => ({
      ...mapInfo,
      [field]: value
    }));
  };

  const [selectedImagePreview, setSelectedImagePreview] = React.useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      updateMapInfo('splash_image', files[0]);

      const imageURL = URL.createObjectURL(files[0]);
      setSelectedImagePreview(imageURL);
    }
  };

  const fetchImage = async (map: ValorantMap, imageName: string, fileType: string) => {
    try {
      const response = await fetch(map.splash_image_url);
      if (response.ok) {
        const blob = await response.blob();
        const imageFile = new File([blob], imageName + `.${fileType}`, {
          type: `image/${fileType}`
        });
        updateMapInfo('splash_image', imageFile);
        setSelectedImagePreview(map.splash_image_url);
      } else {
        console.error('Failed to fetch image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  React.useEffect(() => {
    if (map?.splash_image_url) {
      fetchImage(map, `${map.name}`, 'webp');
    }
  }, [map?.splash_image_url]);

  // Insert New map
  React.useEffect(() => {
    formData.current = mapInfo;
  }, [mapInfo, formData]);

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="text-xs">
            Name
          </label>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={mapInfo.name}
              onChange={(e) => updateMapInfo('name', e.target.value)}
            />
          </div>
        </div>

        {/* Is Active */}
        <div>
          <label htmlFor="isActive" className="text-xs">
            Is Active Map
          </label>
          <div>
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={mapInfo.is_active}
              onChange={(e) => updateMapInfo('is_active', e.target.checked)}
            />
          </div>
        </div>

        {/* Map Image */}
        <div>
          <span className="mb-2 block text-xs">Map Image</span>
          <div className="flex items-center gap-4">
            {/* Custom File Upload Button */}
            <label htmlFor="file-upload" className="cursor-pointer hover:opacity-40">
              {selectedImagePreview ? (
                <Image src={selectedImagePreview} alt={`${map?.name} Picture`} height={60} width={60} />
              ) : (
                <Image src={not_found} alt={`No Image Logo`} height={60} width={60} />
              )}
            </label>
            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {/* Display Selected File Name */}
            <span className="text-sm text-neutral-400">
              {mapInfo.splash_image ? mapInfo.splash_image.name : 'No file chosen'}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
