import Image from 'next/image';

import ButtonUpdate from '@/app/(admin)/_ui/buttons/button-update';
import ButtonDelete from '@/app/(admin)/_ui/buttons/button-delete';
import { GamePlatform, GamePlatformFormType } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';
import { handleDelete, handleUpdate } from '@/app/(admin)/_ui/clients/platforms/utils';
import { ModalProps } from '@/components/ui/modal';

type GamePlatformCardProps = {
  platform: GamePlatform;
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>;
  formData: React.MutableRefObject<GamePlatformFormType | undefined>;
  setCachedPlatforms: React.Dispatch<React.SetStateAction<GamePlatform[]>>;
};

export default function GamePlatformsCard({
  platform,
  setModalProps,
  formData,
  setCachedPlatforms
}: GamePlatformCardProps) {
  return (
    <div className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg">
      <div className="flex gap-4 p-4">
        <div className="flex flex-col place-items-center gap-2">
          {/* Picture */}
          <div className="h-fit border-2 border-neutral-600 p-1">
            {platform.logo_url ? (
              <Image src={platform.logo_url!} alt={`${platform.platform_abbrev} Picture`} height={90} width={90} />
            ) : (
              <Image src={not_found} alt={'Not Found Picture'} height={90} width={90} />
            )}
          </div>

          {/* Buttons */}
          <div className="flex place-items-center gap-4">
            <ButtonUpdate onUpdate={() => handleUpdate(setModalProps, formData, platform, setCachedPlatforms)} />
            <ButtonDelete onDelete={() => handleDelete(setModalProps, platform, setCachedPlatforms)} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-neutral-600">Full Title</p>
            <p className="text-md text-neutral-300">{platform.platform_title}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-600">Abbreviation</p>
            <p className="text-md text-neutral-300">{platform.platform_abbrev}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
