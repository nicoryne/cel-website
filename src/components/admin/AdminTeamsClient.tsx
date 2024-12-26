'use client';

import { Team } from '@/lib/types';
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/20/solid';
import React from 'react';
import Modal, { ModalProps } from '@/components/Modal';
import { createTeam, deleteTeam, getAllTeams, updateTeam } from '@/api';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import TeamsForm from '../forms/TeamsForm';

type AdminTeamsClientProps = {
  teamsList: Team[];
};

export default function AdminTeamsClient({ teamsList }: AdminTeamsClientProps) {
  // local
  const [localTeamsList, setLocalTeamsList] = React.useState<Team[]>(teamsList);

  // Modal
  type FormDataType = {
    school_abbrev: string;
    school_name: string;
    picture: File | null;
    picture_url: string;
  };

  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);
  const formData = React.useRef<FormDataType>({
    school_abbrev: '',
    school_name: '',
    picture: null,
    picture_url: ''
  });

  const resetFormData = () => {
    formData.current = {
      school_abbrev: '',
      school_name: '',
      picture: null,
      picture_url: ''
    };
  };

  const updateTeamsList = async () => {
    const updatedList = await getAllTeams();
    setLocalTeamsList(updatedList);
    setModalProps(null);
    resetFormData();
  };

  const retrieveProcessedData = async () => {
    let processedData = {
      school_abbrev: formData.current.school_abbrev,
      school_name: formData.current.school_name,
      logo_url: ''
    };

    if (formData.current.picture) {
      const supabase = createClient();
      const file = formData.current.picture;
      const fileName = `${formData.current.school_abbrev}_${Date.now()}.${file.type.split('/')[1]}`;

      try {
        const { error } = await supabase.storage
          .from('images/icons/teams')
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
          return;
        }

        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from('images/icons/teams')
            .createSignedUrl(fileName, 60 * 60 * 24 * 365);

        if (signedUrlError) {
          console.error('Signed URL generation error:', signedUrlError);
          return;
        }

        processedData.logo_url = signedUrlData.signedUrl;
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    }

    return processedData;
  };

  const deleteExistingLogo = async (team: Team) => {
    const supabase = createClient();

    const url = new URL(team.logo_url);
    const fileName = url.pathname.replace(
      '/storage/v1/object/sign/images/',
      ''
    );

    const { error } = await supabase.storage.from('images').remove([fileName]);

    if (error) {
      console.error('Remove error:', error);
      return;
    }
  };

  const handleInsertClick = () => {
    setModalProps({
      title: 'Adding New Team',
      type: 'info',
      message: 'Fill out the details to add a new team.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        const processedData = await retrieveProcessedData();

        await createTeam(processedData as {})
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Team has been successfully added!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              await updateTeamsList();
            }, 500);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to add team. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: <TeamsForm team={null} formData={formData} />
    });
  };

  const handleUpdateClick = (team: Team) => {
    setModalProps({
      title: 'Updating Team',
      type: 'info',
      message: 'Fill out the details to update team.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        const processedData = await retrieveProcessedData();

        if (processedData && team.logo_url) {
          await deleteExistingLogo(team);
        }

        await updateTeam(team.id, processedData as {})
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Team has been successfully updated!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              await updateTeamsList();
            }, 500);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to update player. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: <TeamsForm team={team} formData={formData} />
    });
  };

  const handleDeleteClick = (team: Team) => {
    setModalProps({
      title: `Deleting Team`,
      message:
        'Are you sure you want to delete the following team? This action is irreversible.',
      type: 'warning',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        try {
          const deleted = await deleteTeam(team.id);
          if (deleted) {
            await deleteExistingLogo(team);
          }

          setLocalTeamsList((prev) =>
            prev.filter((_, index) => !teamsList.includes(team))
          );

          setModalProps({
            title: 'Success',
            message: `Team has been successfully deleted!`,
            type: 'success',
            onCancel: () => setModalProps(null)
          });

          setTimeout(() => {
            setModalProps(null);
          }, 500);
        } catch {
          setModalProps({
            title: 'Error',
            message: 'Failed to delete team. Please try again.',
            type: 'error',
            onCancel: () => setModalProps(null)
          });
        }
      }
    });
  };

  return (
    <>
      {/* Modal*/}
      {modalProps && (
        <Modal
          title={modalProps.title}
          type={modalProps.type}
          message={modalProps.message}
          onCancel={modalProps.onCancel}
          onConfirm={modalProps.onConfirm}
          children={modalProps.children}
        />
      )}
      {/* Series Control Panel*/}
      <aside className="flex place-items-center bg-neutral-900 p-4">
        {/* Insert & Delete Button */}
        <div className="flex space-x-4">
          <button
            type="button"
            className="flex place-items-center space-x-2 rounded-md border-2 border-green-700 bg-green-900 px-3 py-1 hover:border-green-600"
            onClick={handleInsertClick}
          >
            <span>
              <PlusIcon className="h-auto w-3 text-green-600" />
            </span>
            <span className="text-xs text-green-100">Insert</span>
          </button>
        </div>
        {/* End of Buttons */}
        <div className="flex w-fit flex-col"></div>
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full overflow-x-auto">
        <ul className="grid grid-cols-2 gap-8 p-8">
          {localTeamsList.map((team, index) => (
            <li
              key={index}
              className="rounded border-2 border-neutral-800 bg-neutral-900 p-4"
            >
              <div className="flex place-items-center gap-8">
                {/* Image */}
                <Image
                  src={team.logo_url}
                  alt={`${team.school_abbrev} Logo`}
                  width={80}
                  height={80}
                />
                {/* Titles */}
                <div className="flex flex-col gap-4">
                  {/* Full Title */}
                  <div>
                    <p className="text-xs font-semibold text-neutral-600">
                      Full Title
                    </p>
                    <p className="text-md text-neutral-300">
                      {team.school_name}
                    </p>
                  </div>
                  {/* Abbrev */}
                  <div>
                    <p className="text-xs font-semibold text-neutral-600">
                      Abbreviation
                    </p>
                    <p className="text-md text-neutral-300">
                      {team.school_abbrev}
                    </p>
                  </div>
                  {/* Buttons */}
                  <div className="flex place-items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(team)}
                    >
                      <PencilSquareIcon className="h-auto w-4 cursor-pointer text-neutral-400 hover:text-[var(--cel-blue)]" />
                    </button>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(team)}
                      >
                        <TrashIcon className="h-auto w-4 text-neutral-400 hover:text-[var(--cel-red)]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* End of Content */}
    </>
  );
}
