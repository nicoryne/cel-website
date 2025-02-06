'use client';
import React from 'react';
import Image from 'next/image';
import { PartnerFormType, Partner } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';

interface PartnerFormProps {
  formData: React.MutableRefObject<PartnerFormType | undefined>;
  partner: Partner | null;
}

export default function PartnerForm({ formData, partner }: PartnerFormProps) {
  const [partnerInfo, setPartnerInfo] = React.useState<PartnerFormType>({
    name: partner?.name || '',
    href: partner?.href || '',
    logo: null
  });

  const [selectedImagePreview, setSelectedImagePreview] = React.useState('');

  const updatePartnerInfo = (field: keyof PartnerFormType, value: File | string) => {
    setPartnerInfo((partnerInfo) => ({
      ...partnerInfo,
      [field]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      updatePartnerInfo('logo', files[0]);

      const imageURL = URL.createObjectURL(files[0]);
      setSelectedImagePreview(imageURL);
    }
  };

  const fetchImage = async (partner: Partner, imageName: string, fileType: string) => {
    try {
      const response = await fetch(partner.logo_url);
      if (response.ok) {
        const blob = await response.blob();
        const imageFile = new File([blob], imageName + `.${fileType}`, {
          type: `image/${fileType}`
        });
        updatePartnerInfo('logo', imageFile);
        setSelectedImagePreview(partner.logo_url);
      } else {
        console.error('Failed to fetch image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  React.useEffect(() => {
    if (partner?.logo_url) {
      fetchImage(partner, `${partner.name}`, 'webp');
    }
  }, [partner?.logo_url]);

  // Insert New Partner
  React.useEffect(() => {
    formData.current = partnerInfo;
  }, [partnerInfo, formData]);

  return (
    <form className="my-4 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Title */}
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
              value={partnerInfo.name}
              onChange={(e) => updatePartnerInfo('name', e.target.value)}
            />
          </div>
        </div>

        {/* Link */}
        <div>
          <label htmlFor="link" className="text-xs">
            Link
          </label>
          <div>
            <input
              type="text"
              name="link"
              id="link"
              className="h-10 w-full rounded-md border-2 border-neutral-700 bg-neutral-900"
              value={partnerInfo.href}
              onChange={(e) => updatePartnerInfo('href', e.target.value)}
            />
          </div>
        </div>

        {/* Partner Image */}
        <div>
          <span className="mb-2 block text-xs">Partner Image</span>
          <div className="flex items-center gap-4">
            {/* Custom File Upload Button */}
            <label htmlFor="file-upload" className="cursor-pointer hover:opacity-40">
              {selectedImagePreview ? (
                <Image
                  src={selectedImagePreview}
                  alt={`${partner?.name} Picture`}
                  height={60}
                  width={60}
                />
              ) : (
                <Image src={not_found} alt={`No Image Logo`} height={60} width={60} />
              )}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {/* Display Selected File Name */}
            <span className="text-sm text-neutral-400">
              {partnerInfo.logo ? partnerInfo.logo.name : 'No file chosen'}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
