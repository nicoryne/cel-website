import Image from 'next/image';

import ButtonUpdate from '@/components/admin/buttons/button-update';
import ButtonDelete from '@/components/admin/buttons/button-delete';
import { TeamFormType, Team } from '@/lib/types';
import not_found from '@/../../public/images/not-found.webp';
import { handleDelete, handleUpdate } from '@/components/admin/clients/teams/utils';
import { ModalProps } from '@/components/modal';

type TeamCardProps = {
  team: Team;
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>;
  formData: React.MutableRefObject<TeamFormType | undefined>;
  setCachedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
};

export default function TeamsCard({ team, setModalProps, formData, setCachedTeams }: TeamCardProps) {
  return (
    <div className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg">
      <div className="flex gap-4 p-4">
        <div className="flex flex-col place-items-center gap-2">
          {/* Picture */}
          <div className="h-fit border-2 border-neutral-600 p-1">
            {team.logo_url ? (
              <Image src={team.logo_url!} alt={`${team.school_abbrev} Picture`} height={90} width={90} />
            ) : (
              <Image src={not_found} alt={'Not Found Picture'} height={90} width={90} />
            )}
          </div>

          {/* Buttons */}
          <div className="flex place-items-center gap-4">
            <ButtonUpdate onUpdate={() => handleUpdate(setModalProps, formData, team, setCachedTeams)} />
            <ButtonDelete onDelete={() => handleDelete(setModalProps, team, setCachedTeams)} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-neutral-600">Full Title</p>
            <p className="text-md text-neutral-300">{team.school_name}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-600">Abbreviation</p>
            <p className="text-md text-neutral-300">{team.school_abbrev}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
