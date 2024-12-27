'use client';

import { GamePlatform, CharacterWithDetails } from '@/lib/types';
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/20/solid';
import React from 'react';
import Modal, { ModalProps } from '@/components/Modal';
import {
  createCharacter,
  deleteCharacter,
  getAllCharactersWithDetails,
  updateCharacter
} from '@/api';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import not_found from '@/../../public/images/not-found.webp';
import CharactersForm from '@/components/forms/CharactersForm';

type AdminCharactersClientProps = {
  charactersList: CharacterWithDetails[];
  platforms: GamePlatform[];
};

export default function AdminCharactersClient({
  charactersList,
  platforms
}: AdminCharactersClientProps) {
  const [localCharactersList, setLocalCharactersList] =
    React.useState<CharacterWithDetails[]>(charactersList);

  // Pagination State
  const [paginatedCharacters, setPaginatedCharacters] =
    React.useState<CharacterWithDetails[]>(localCharactersList);

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(localCharactersList.length / itemsPerPage);

  React.useEffect(() => {
    const sortedcharacters = [...localCharactersList].sort((a, b) => {
      const platformComparison = (
        a.platform?.platform_abbrev || ''
      ).localeCompare(b.platform?.platform_abbrev || '');
      if (platformComparison !== 0) return platformComparison;

      return (a.name || '').localeCompare(b.name || '');
    });

    const paginated = sortedcharacters.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setPaginatedCharacters(paginated);
  }, [localCharactersList, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Searching
  const [searchFilter, setSearchFilter] = React.useState('');

  React.useEffect(() => {
    const filteredList = charactersList.filter((character) =>
      character.name.toLowerCase().includes(searchFilter.toLowerCase())
    );

    setLocalCharactersList(filteredList);
    setCurrentPage(1);
  }, [searchFilter, charactersList]);

  // Modal
  type FormDataType = {
    name: string;
    role: string;
    logo: File | null;
    logo_url: string;
    platform_id: string;
  };

  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);
  const formData = React.useRef<FormDataType>({
    name: '',
    role: '',
    logo: null,
    logo_url: '',
    platform_id: ''
  });

  const resetFormData = () => {
    formData.current = {
      name: '',
      role: '',
      logo: null,
      logo_url: '',
      platform_id: ''
    };
  };

  const updateCharactersList = async () => {
    const updatedList = await getAllCharactersWithDetails();
    setLocalCharactersList(updatedList);
    setModalProps(null);
    resetFormData();
  };

  const retrieveProcessedData = async () => {
    let processedData = {
      name: formData.current.name,
      role: formData.current.role,
      logo_url: '',
      platform_id: formData.current.platform_id
    };

    if (formData.current.logo) {
      const supabase = createClient();
      const file = formData.current.logo;
      const fileName = `${formData.current.name}_${Date.now()}.${file.type.split('/')[1]}`;

      try {
        const { error } = await supabase.storage
          .from('images/icons/characters')
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
          return;
        }

        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from('images/icons/characters')
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

  const deleteExistingPicture = async (character: CharacterWithDetails) => {
    const supabase = createClient();

    const url = new URL(character.logo_url);
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
      title: 'Adding New Character',
      type: 'info',
      message: 'Fill out the details to add a new character.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        const processedData = await retrieveProcessedData();

        await createCharacter(processedData as {})
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Character has been successfully added!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              updateCharactersList();
            }, 2000);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to add character. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: (
        <CharactersForm
          character={null}
          formData={formData}
          platforms={platforms}
        />
      )
    });
  };

  const handleUpdateClick = (character: CharacterWithDetails) => {
    setModalProps({
      title: 'Updating Character',
      type: 'info',
      message: 'Fill out the details to update character.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        const processedData = await retrieveProcessedData();

        if (processedData && character.logo_url) {
          await deleteExistingPicture(character);
        }

        await updateCharacter(character.id, processedData as {})
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Character has been successfully updated!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              updateCharactersList();
            }, 2000);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to update character. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: (
        <CharactersForm
          character={character}
          formData={formData}
          platforms={platforms}
        />
      )
    });
  };

  const handleDeletecharacter = (character: CharacterWithDetails) => {
    setModalProps({
      title: `Deleting Character`,
      message:
        'Are you sure you want to delete the following character? This action is irreversible.',
      type: 'warning',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        try {
          const deleted = await deleteCharacter(character.id);
          if (deleted && character.logo_url) {
            deleteExistingPicture(character);
          }

          updateCharactersList();

          setModalProps({
            title: 'Success',
            message: `Character has been successfully deleted!`,
            type: 'success',
            onCancel: () => setModalProps(null)
          });

          setTimeout(() => {
            setModalProps(null);
          }, 2000);
        } catch {
          setModalProps({
            title: 'Error',
            message: 'Failed to delete character. Please try again.',
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
      <aside className="flex place-items-center gap-4 bg-neutral-900 p-4">
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

        <MagnifyingGlassIcon className="h-auto w-4 text-neutral-600" />
        <input
          type="text"
          className="bg-neutral-800 text-xs"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full overflow-x-auto">
        {/* character Cards */}
        <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3">
          {paginatedCharacters.map((character, index) => (
            <li
              className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg"
              key={index}
            >
              {/* Body */}
              <div className="flex gap-4 p-4">
                <div className="flex flex-col place-items-center gap-2">
                  {/* Picture */}
                  <div className="h-fit border-2 border-neutral-600 p-1">
                    {character.logo_url ? (
                      <Image
                        src={character.logo_url!}
                        alt={`${character.name} Picture`}
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
                      onClick={() => handleUpdateClick(character)}
                    >
                      <PencilSquareIcon className="h-auto w-4 cursor-pointer text-neutral-400 hover:text-[var(--cel-blue)]" />
                    </button>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleDeletecharacter(character)}
                      >
                        <TrashIcon className="h-auto w-4 text-neutral-400 hover:text-[var(--cel-red)]" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-neutral-600">
                      Name
                    </p>
                    <p className="text-md text-neutral-300">{character.name}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-neutral-600">
                      Role
                    </p>
                    <p className="text-md text-neutral-300">{character.role}</p>
                  </div>
                </div>
              </div>
              {/* Upper Container */}
              <footer className="flex justify-between border-t-2 border-neutral-600 bg-neutral-900 px-4 py-2">
                <div className="flex gap-4">
                  <Image
                    src={character.platform?.logo_url!}
                    alt={`${character.platform?.platform_abbrev} Logo`}
                    height={16}
                    width={16}
                  />
                  <p className="text-xs font-bold text-neutral-500">
                    {character.platform?.platform_title}
                  </p>
                </div>
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
