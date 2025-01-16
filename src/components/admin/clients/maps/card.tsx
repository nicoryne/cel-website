import Image from 'next/image';

import ButtonUpdate from '@/components/admin/buttons/button-update';
import ButtonDelete from '@/components/admin/buttons/button-delete';
import { ValorantMap, ValorantMapFormType } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';
import { handleDelete, handleUpdate } from '@/components/admin/clients/maps/utils';
import { ModalProps } from '@/components/modal';

type MapsCardProps = {
  map: ValorantMap;
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>;
  formData: React.MutableRefObject<ValorantMapFormType | undefined>;
  setCachedMaps: React.Dispatch<React.SetStateAction<ValorantMap[]>>;
};

export default function MapsCard({ map, setModalProps, formData, setCachedMaps }: MapsCardProps) {
  return (
    <div className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg">
      <div className="flex gap-4 p-4">
        <div className="flex flex-col place-items-center gap-2">
          {/* Picture */}
          <div className="h-fit border-2 border-neutral-600 p-1">
            {map.splash_image_url ? (
              <Image src={map.splash_image_url!} alt={`${map.name} Picture`} height={90} width={90} />
            ) : (
              <Image src={not_found} alt={'Not Found Picture'} height={90} width={90} />
            )}
          </div>

          {/* Buttons */}
          <div className="flex place-items-center gap-4">
            <ButtonUpdate onUpdate={() => handleUpdate(setModalProps, formData, map, setCachedMaps)} />
            <ButtonDelete onDelete={() => handleDelete(setModalProps, map, setCachedMaps)} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-neutral-600">Full Title</p>
            <p className="text-md text-neutral-300">{map.name}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-600">Is Active</p>
            <p className="text-md text-neutral-300">{map.is_active ? 'Active' : 'Not Active'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
