import Image from 'next/image';

import ButtonUpdate from '@/app/(admin)/dashboard/_components/button-update';
import ButtonDelete from '@/app/(admin)/dashboard/_components/button-delete';
import { Partner, PartnerFormType } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';
import { handleDelete, handleUpdate } from '@/app/(admin)/dashboard/partners/_components/utils';
import { ModalProps } from '@/components/ui/modal';

interface PartnersCardProps {
  partner: Partner;
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>;
  formData: React.MutableRefObject<PartnerFormType | undefined>;
  setCachedPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
}

export default function PartnersCard({
  partner,
  setModalProps,
  formData,
  setCachedPartners
}: PartnersCardProps) {
  return (
    <div className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg">
      <div className="flex gap-4 p-4">
        <div className="flex flex-col place-items-center gap-2">
          {/* Picture */}
          <div className="h-fit border-2 border-neutral-600 p-1">
            {partner.logo_url ? (
              <Image
                src={partner.logo_url!}
                alt={`${partner.name} Picture`}
                height={90}
                width={90}
              />
            ) : (
              <Image src={not_found} alt={'Not Found Picture'} height={90} width={90} />
            )}
          </div>

          {/* Buttons */}
          <div className="flex place-items-center gap-4">
            <ButtonUpdate
              onUpdate={() => handleUpdate(setModalProps, formData, partner, setCachedPartners)}
            />
            <ButtonDelete
              onDelete={() => handleDelete(setModalProps, partner, setCachedPartners)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-neutral-600">Full Title</p>
            <p className="text-md text-neutral-300">{partner.name}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-600">Link</p>
            <p className="text-md text-neutral-300">{partner.href}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
