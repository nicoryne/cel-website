import Image from 'next/image';

import ButtonUpdate from '@/app/(admin)/dashboard/_components/button-update';
import ButtonDelete from '@/app/(admin)/dashboard/_components/button-delete';
import { PlayerFormType, PlayerWithDetails } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';
import { handleDelete, handleUpdate } from '@/app/(admin)/dashboard/players/_components/utils';
import { ModalProps } from '@/components/ui/modal';

type PlayerCardProps = {
  player: PlayerWithDetails;
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>;
  formData: React.MutableRefObject<PlayerFormType | undefined>;
  setCachedPlayers: React.Dispatch<React.SetStateAction<PlayerWithDetails[]>>;
};

export default function PlayerCard({
  player,
  setModalProps,
  formData,
  setCachedPlayers
}: PlayerCardProps) {
  return (
    <div className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg">
      <div className="flex gap-4 p-4">
        <div className="flex flex-col place-items-center gap-2">
          {/* Picture */}
          <div className="h-fit border-2 border-neutral-600 p-1">
            {player.picture_url ? (
              <Image
                src={player.picture_url!}
                alt={`${player.ingame_name} Picture`}
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
              onUpdate={() => handleUpdate(setModalProps, formData, player, setCachedPlayers)}
            />
            <div className="flex gap-1">
              <ButtonDelete
                onDelete={() => handleDelete(setModalProps, player, setCachedPlayers)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-neutral-600">In-game Name</p>
            <p className="text-md text-neutral-300">{player.ingame_name}</p>
          </div>

          <div className="flex gap-4">
            <div>
              <p className="text-xs font-semibold text-neutral-600">First Name</p>
              <p className="text-md text-neutral-300">{player.first_name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-600">Last Name</p>
              <p className="text-md text-neutral-300">{player.last_name}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-600">Roles</p>
            <ul className="flex list-disc flex-wrap gap-8 px-4 text-xs text-neutral-300">
              {player.roles.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Upper Container */}
      <footer className="flex justify-between border-t-2 border-neutral-600 bg-neutral-900 px-4 py-2">
        <div className="flex gap-4">
          <Image
            src={player.team?.logo_url!}
            alt={`${player.team?.school_abbrev} Logo`}
            height={16}
            width={16}
          />
          <p className="text-xs font-bold text-neutral-500">{player.team?.school_name}</p>
        </div>

        <Image
          className="rounded-full"
          src={player.platform?.logo_url!}
          alt={`${player.platform?.platform_abbrev} Logo`}
          height={16}
          width={16}
        />
      </footer>
    </div>
  );
}
