'use client';

import { GamePlatform, PlayerWithDetails, Team } from '@/lib/types';
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/20/solid';
import React from 'react';
import Modal, { ModalProps } from '@/components/modal';
import PlayerForm from '@/components/forms/player-form';
import {
  createPlayer,
  deletePlayer,
  getAllPlayersWithDetails,
  updatePlayer
} from '@/api/player';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import not_found from '@/../../public/images/not-found.webp';

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

  // Pagination State
  const [paginatedPlayers, setPaginatedPlayers] =
    React.useState<PlayerWithDetails[]>(localPlayersList);

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(localPlayersList.length / itemsPerPage);

  React.useEffect(() => {
    const sortedPlayers = [...localPlayersList].sort((a, b) => {
      const schoolComparison = (a.team?.school_abbrev || '').localeCompare(
        b.team?.school_abbrev || ''
      );
      if (schoolComparison !== 0) return schoolComparison;

      const platformComparison = (
        a.platform?.platform_abbrev || ''
      ).localeCompare(b.platform?.platform_abbrev || '');
      if (platformComparison !== 0) return platformComparison;

      return (a.ingame_name || '').localeCompare(b.ingame_name || '');
    });

    const paginated = sortedPlayers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setPaginatedPlayers(paginated);
  }, [localPlayersList, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Searching
  const [searchFilter, setSearchFilter] = React.useState('');

  React.useEffect(() => {
    const filteredList = playersList.filter(
      (player) =>
        player.first_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        player.ingame_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        player.last_name.toLowerCase().includes(searchFilter.toLowerCase())
    );

    setLocalPlayersList(filteredList);
    setCurrentPage(1);
  }, [searchFilter, playersList]);

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

  const resetFormData = () => {
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
  };

  const updatePlayersList = async () => {
    const updatedList = await getAllPlayersWithDetails();
    setLocalPlayersList(updatedList);
    setModalProps(null);
    resetFormData();
  };

  const retrieveProcessedData = async () => {
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
        const { error } = await supabase.storage
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

    return processedData;
  };

  const deleteExistingPicture = async (player: PlayerWithDetails) => {
    const supabase = createClient();

    const url = new URL(player.picture_url);
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
      title: 'Adding New Player',
      type: 'info',
      message: 'Fill out the details to add a new player.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        const processedData = await retrieveProcessedData();

        await createPlayer(processedData as {})
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Player has been successfully added!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              updatePlayersList();
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
        const processedData = await retrieveProcessedData();

        if (processedData && player.picture_url) {
          await deleteExistingPicture(player);
        }

        await updatePlayer(player.id, processedData as {})
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Player has been successfully updated!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              updatePlayersList();
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

  const handleDeletePlayer = (player: PlayerWithDetails) => {
    setModalProps({
      title: `Deleting Player`,
      message:
        'Are you sure you want to delete the following player? This action is irreversible.',
      type: 'warning',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        try {
          const deleted = await deletePlayer(player.id);
          if (deleted && player.picture_url) {
            deleteExistingPicture(player);
          }

          updatePlayersList();

          setModalProps({
            title: 'Success',
            message: `Player has been successfully deleted!`,
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
      {/* Series Control Panel*/}
      <aside className="flex place-items-center justify-between gap-4 bg-neutral-900 p-4">
        <div>
          <div className="flex gap-2">
            {/* Search */}
            <MagnifyingGlassIcon className="h-auto w-4 text-neutral-600" />
            <input
              type="text"
              className="bg-neutral-800 text-xs"
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Insert */}
        <button
          className="flex place-items-center space-x-2 rounded-md border-2 border-green-700 bg-green-900 px-3 py-1 hover:border-green-600"
          onClick={handleInsertClick}
        >
          <span>
            <PlusIcon className="h-auto w-3 text-green-600" />
          </span>
          <span className="text-xs text-green-100">Insert</span>
        </button>
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full overflow-x-auto">
        {/* Player Cards */}
        <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3">
          {paginatedPlayers.map((player, index) => (
            <li
              className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg"
              key={index}
            >
              {/* Body */}
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
                      <Image
                        src={not_found}
                        alt={'Not Found Picture'}
                        height={90}
                        width={90}
                      />
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex place-items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(player)}
                    >
                      <PencilSquareIcon className="h-auto w-4 cursor-pointer text-neutral-400 hover:text-[var(--cel-blue)]" />
                    </button>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleDeletePlayer(player)}
                      >
                        <TrashIcon className="h-auto w-4 text-neutral-400 hover:text-[var(--cel-red)]" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-neutral-600">
                      In-game Name
                    </p>
                    <p className="text-md text-neutral-300">
                      {player.ingame_name}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs font-semibold text-neutral-600">
                        First Name
                      </p>
                      <p className="text-md text-neutral-300">
                        {player.first_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-600">
                        Last Name
                      </p>
                      <p className="text-md text-neutral-300">
                        {player.last_name}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-neutral-600">
                      Roles
                    </p>
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
                  <p className="text-xs font-bold text-neutral-500">
                    {player.team?.school_name}
                  </p>
                </div>

                <Image
                  className="rounded-full"
                  src={player.platform?.logo_url!}
                  alt={`${player.platform?.platform_abbrev} Logo`}
                  height={16}
                  width={16}
                />
              </footer>
            </li>
          ))}
        </ul>
      </div>
      {/* End of Content */}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 py-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`rounded px-3 py-1 ${
            currentPage === 1
              ? 'bg-neutral-700 text-neutral-500'
              : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`rounded px-3 py-1 ${
              page === currentPage
                ? 'bg-[var(--cel-blue)] text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className={`rounded px-3 py-1 ${
            currentPage === totalPages
              ? 'bg-neutral-700 text-neutral-500'
              : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}
