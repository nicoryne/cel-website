'use client';

import { GamePlatform, PlayerWithDetails, Team } from '@/lib/types';
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/20/solid';
import React from 'react';
import Modal, { ModalProps } from '@/components/Modal';
import PlayerForm from '@/components/forms/PlayerForm';
import {
  createPlayer,
  deletePlayer,
  getAllPlayersWithDetails,
  updatePlayer
} from '@/api';
import { createClient } from '@/lib/supabase/client';

const tableHeaders = [
  '#',
  'Ingame Name',
  'Team',
  'Platform',
  'Last Name',
  'First Name',
  ''
];

type AdminPlayersClientProps = {
  playersList: PlayerWithDetails[];
  teamsList: Team[];
  platforms: GamePlatform[];
};

export default function AdminPlayersClient({
  playersList,
  teamsList,
  platforms
}: AdminPlayersClientProps) {
  const [localPlayersList, setLocalPlayersList] =
    React.useState<PlayerWithDetails[]>(playersList);

  const [isARowChecked, setIsARowChecked] = React.useState(false);
  const [checkedRows, setCheckedRows] = React.useState<boolean[]>(
    new Array(playersList.length).fill(false)
  );

  React.useEffect(() => {
    setCheckedRows(new Array(playersList.length).fill(false));
  }, [playersList.length]);

  React.useEffect(() => {
    setIsARowChecked(checkedRows.some(Boolean));
  }, [checkedRows]);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleString('en-CA', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const handleRowCheckboxChange = (index: number) => {
    setCheckedRows((prev) => {
      const newCheckedRows = [...prev];
      newCheckedRows[index] = !newCheckedRows[index];
      return newCheckedRows;
    });
  };

  const handleRowCheckboxCheckAll = () => {
    const allChecked = checkedRows.every((checked) => checked);
    setCheckedRows(new Array(playersList.length).fill(!allChecked));
  };

  // Modal
  type FormDataType = {
    first_name: string;
    last_name: string;
    ingame_name: string;
    team_id: string;
    game_platform_id: string;
    roles: string[];
    picture: File | null;
    picture_url: string;
  };

  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);
  const formData = React.useRef<FormDataType>({
    first_name: '',
    last_name: '',
    ingame_name: '',
    team_id: '',
    game_platform_id: '',
    roles: [],
    picture: null,
    picture_url: ''
  });

  const handleInsertClick = () => {
    setModalProps({
      title: 'Adding New Player',
      type: 'info',
      message: 'Fill out the details to add a new player.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        let processedData = {
          first_name: formData.current.first_name,
          last_name: formData.current.last_name,
          ingame_name: formData.current.ingame_name,
          team_id: formData.current.team_id,
          game_platform_id: formData.current.game_platform_id,
          roles: formData.current.roles,
          picture_url: ''
        };
        if (formData.current.picture) {
          const supabase = createClient();
          const file = formData.current.picture;
          const fileName = `${formData.current.ingame_name}_${Date.now()}.${file.type.split('/')[1]}`;
          try {
            const { data, error } = await supabase.storage
              .from('images/player_images')
              .upload(fileName, file);

            if (error) {
              console.error('Upload error:', error);
              return;
            }

            const { data: signedUrlData, error: signedUrlError } =
              await supabase.storage
                .from('images/player_images')
                .createSignedUrl(fileName, 60 * 60 * 24 * 365);

            if (signedUrlError) {
              console.error('Signed URL generation error:', signedUrlError);
              return;
            }

            processedData.picture_url = signedUrlData.signedUrl;
          } catch (err) {
            console.error('Unexpected error:', err);
          }
        }

        await createPlayer(processedData)
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Player has been successfully added!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              const updatedList = await getAllPlayersWithDetails();
              setLocalPlayersList(updatedList);
              setModalProps(null);
              formData.current = {
                first_name: '',
                last_name: '',
                ingame_name: '',
                team_id: '',
                game_platform_id: '',
                roles: [],
                picture: null,
                picture_url: ''
              };
            }, 2000);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to add player. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: (
        <PlayerForm
          teamsList={teamsList}
          platforms={platforms}
          formData={formData}
          player={null}
        />
      )
    });
  };

  const handleUpdateClick = (player: PlayerWithDetails) => {
    setModalProps({
      title: 'Updating Player',
      type: 'info',
      message: 'Fill out the details to update player.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        let processedData = {
          first_name: formData.current.first_name,
          last_name: formData.current.last_name,
          ingame_name: formData.current.ingame_name,
          team_id: formData.current.team_id,
          game_platform_id: formData.current.game_platform_id,
          roles: formData.current.roles,
          picture_url: ''
        };

        if (formData.current.picture) {
          const supabase = createClient();
          const file = formData.current.picture;
          const fileName = `${formData.current.ingame_name}_${Date.now()}.${file.type.split('/')[1]}`;
          try {
            const { data, error } = await supabase.storage
              .from('images/player_images')
              .upload(fileName, file);

            if (error) {
              console.error('Upload error:', error);
              return;
            }

            const { data: signedUrlData, error: signedUrlError } =
              await supabase.storage
                .from('images/player_images')
                .createSignedUrl(fileName, 60 * 60 * 24 * 365);

            if (signedUrlError) {
              console.error('Signed URL generation error:', signedUrlError);
              return;
            }

            processedData.picture_url = signedUrlData.signedUrl;
          } catch (err) {
            console.error('Unexpected error:', err);
          }
        }

        await updatePlayer(player.id, processedData)
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Player has been successfully updated!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              const updatedList = await getAllPlayersWithDetails();
              setLocalPlayersList(updatedList);
              setModalProps(null);
              formData.current = {
                first_name: '',
                last_name: '',
                ingame_name: '',
                team_id: '',
                game_platform_id: '',
                roles: [],
                picture: null,
                picture_url: ''
              };
            }, 2000);
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
      children: (
        <PlayerForm
          teamsList={teamsList}
          platforms={platforms}
          formData={formData}
          player={player}
        />
      )
    });
  };

  const handleDeletePlayer = () => {
    const toDeleteRows = checkedRows
      .map((isChecked, index) => (isChecked ? index : -1))
      .filter((index) => index !== -1);

    setModalProps({
      title: `Deleting Player`,
      message:
        'Are you sure you want to delete the following player? This action is irreversible.',
      type: 'warning',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        try {
          const successfullyDeletedIndices: number[] = [];
          const supabase = createClient();

          for (const rowIndex of toDeleteRows) {
            let player = localPlayersList[rowIndex];
            const deleted = await deletePlayer(localPlayersList[rowIndex].id);
            if (deleted) {
              const url = new URL(player.picture_url);
              const fileName = url.pathname.replace(
                '/storage/v1/object/sign/images/',
                ''
              );
              console.log(fileName);
              const { error } = await supabase.storage
                .from('images')
                .remove([fileName]);
              successfullyDeletedIndices.push(rowIndex);
            }
          }

          setLocalPlayersList((prev) =>
            prev.filter(
              (_, index) => !successfullyDeletedIndices.includes(index)
            )
          );

          setCheckedRows((prev) =>
            prev.filter(
              (_, index) => !successfullyDeletedIndices.includes(index)
            )
          );

          setModalProps({
            title: 'Success',
            message: `${successfullyDeletedIndices.length} players have been successfully deleted!`,
            type: 'success',
            onCancel: () => setModalProps(null)
          });

          setTimeout(() => {
            setModalProps(null);
          }, 2000);
        } catch {
          setModalProps({
            title: 'Error',
            message: 'Failed to delete player. Please try again.',
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
      {/* Players Table */}
      <div className="flex space-x-4 bg-neutral-900 p-2">
        {!isARowChecked && (
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
        )}
        {isARowChecked && (
          <button
            onClick={() =>
              setCheckedRows(new Array(playersList.length).fill(false))
            }
            className="flex place-items-center space-x-2 rounded-md border-2 border-neutral-700 bg-neutral-900 px-3 py-1 hover:border-neutral-600"
          >
            <span>
              <XMarkIcon className="h-auto w-3 text-neutral-200" />
            </span>
          </button>
        )}
        {isARowChecked && (
          <button
            type="button"
            className="flex place-items-center space-x-2 rounded-md border-2 border-red-700 bg-red-900 px-3 py-1 hover:border-red-600"
            onClick={handleDeletePlayer}
          >
            <span>
              <TrashIcon className="h-auto w-3 text-red-200" />
            </span>
            <span className="text-xs text-red-100">Delete</span>
          </button>
        )}
      </div>
      <div className="w-full overflow-x-auto border-2 border-neutral-800 shadow-md">
        <table className="w-full text-sm text-neutral-500">
          <thead className="text-md text-nowrap bg-neutral-800 text-center text-neutral-300">
            <tr>
              <th className="px-2">
                <input
                  type="checkbox"
                  checked={checkedRows.every(Boolean)}
                  onChange={handleRowCheckboxCheckAll}
                  className="rounded bg-neutral-800 text-[var(--accent-primary)] outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                />
              </th>
              {tableHeaders.map((header, index) => (
                <th scope="col" key={index} className="px-4 py-2 font-normal">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {localPlayersList.map((player, index) => (
              <tr
                key={player.id}
                className="border-b border-transparent text-center text-xs hover:text-neutral-300 [&:not(:last-child)]:border-neutral-700"
              >
                <td>
                  <input
                    type="checkbox"
                    checked={checkedRows[index]}
                    onChange={() => handleRowCheckboxChange(index)}
                    className="rounded bg-neutral-800 text-[var(--accent-primary)] outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  />
                </td>
                <td className="py-2">{index + 1}</td>
                <td>{player.ingame_name}</td>
                <td>{player.team?.school_abbrev || 'N/A'}</td>
                <td>{player.platform?.platform_abbrev || 'N/A'}</td>
                <td>{player.last_name}</td>
                <td>{player.first_name}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleUpdateClick(player)}
                  >
                    <PencilSquareIcon className="h-auto w-4 cursor-pointer hover:text-[var(--accent-secondary)]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
