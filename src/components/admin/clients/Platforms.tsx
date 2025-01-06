'use client';

import { GamePlatform } from '@/lib/types';
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/20/solid';
import React from 'react';
import Modal, { ModalProps } from '@/components/modal';
import {
  createGamePlatform,
  deleteGamePlatform,
  getAllGamePlatforms,
  updateGamePlatform
} from '@/api/game-platform';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import not_found from '@/../../public/images/not-found.webp';
import PlatformsForm from '@/components/forms/platforms-form';

type AdminPlatformsClientProps = {
  platforms: GamePlatform[];
};

export default function AdminPlatformsClient({
  platforms
}: AdminPlatformsClientProps) {
  const [localPlatformsList, setLocalPlatformsList] =
    React.useState<GamePlatform[]>(platforms);

  // Pagination State
  const [paginatedPlatforms, setPaginatedPlatforms] =
    React.useState<GamePlatform[]>(localPlatformsList);

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(localPlatformsList.length / itemsPerPage);

  React.useEffect(() => {
    const paginated = localPlatformsList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setPaginatedPlatforms(paginated);
  }, [localPlatformsList, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Modal
  type FormDataType = {
    platform_title: string;
    platform_abbrev: string;
    logo: File | null;
    logo_url: string;
  };

  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);
  const formData = React.useRef<FormDataType>({
    platform_title: '',
    platform_abbrev: '',
    logo: null,
    logo_url: ''
  });

  const resetFormData = () => {
    formData.current = {
      platform_title: '',
      platform_abbrev: '',
      logo: null,
      logo_url: ''
    };
  };

  const updatePlatformsList = async () => {
    const updatedList = await getAllGamePlatforms();
    setLocalPlatformsList(updatedList);
    setModalProps(null);
    resetFormData();
  };

  const retrieveProcessedData = async () => {
    let processedData = {
      platform_title: formData.current.platform_title,
      platform_abbrev: formData.current.platform_abbrev,
      logo_url: ''
    };

    if (formData.current.logo) {
      const supabase = createClient();
      const file = formData.current.logo;
      const fileName = `${formData.current.platform_abbrev}_${Date.now()}.${file.type.split('/')[1]}`;

      try {
        const { error } = await supabase.storage
          .from('images/icons/platforms')
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
          return;
        }

        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from('images/icons/platforms')
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

  const deleteExistingPicture = async (platform: GamePlatform) => {
    const supabase = createClient();

    const url = new URL(platform.logo_url);
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
      title: 'Adding New Platform',
      type: 'info',
      message: 'Fill out the details to add a new Platform.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        const processedData = await retrieveProcessedData();

        await createGamePlatform(processedData as {})
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Platform has been successfully added!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              updatePlatformsList();
            }, 2000);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to add Platform. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: <PlatformsForm platform={null} formData={formData} />
    });
  };

  const handleUpdateClick = (platform: GamePlatform) => {
    setModalProps({
      title: 'Updating Platform',
      type: 'info',
      message: 'Fill out the details to update Platform.',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        const processedData = await retrieveProcessedData();

        if (processedData && platform.logo_url) {
          await deleteExistingPicture(platform);
        }

        await updateGamePlatform(platform.id, processedData as {})
          .then(() => {
            setModalProps({
              title: 'Success',
              message: 'Platform has been successfully updated!',
              type: 'success',
              onCancel: () => setModalProps(null)
            });

            setTimeout(async () => {
              updatePlatformsList();
            }, 2000);
          })
          .catch(() => {
            setModalProps({
              title: 'Error',
              message: 'Failed to update Platform. Please try again.',
              type: 'error',
              onCancel: () => setModalProps(null)
            });
          });
      },
      children: <PlatformsForm platform={platform} formData={formData} />
    });
  };

  const handleDeletePlatform = (platform: GamePlatform) => {
    setModalProps({
      title: `Deleting Platform`,
      message:
        'Are you sure you want to delete the following Platform? This action is irreversible.',
      type: 'warning',
      onCancel: () => setModalProps(null),
      onConfirm: async () => {
        try {
          const deleted = await deleteGamePlatform(platform.id);
          if (deleted && platform.logo_url) {
            deleteExistingPicture(platform);
          }

          updatePlatformsList();

          setModalProps({
            title: 'Success',
            message: `Platform has been successfully deleted!`,
            type: 'success',
            onCancel: () => setModalProps(null)
          });

          setTimeout(() => {
            setModalProps(null);
          }, 2000);
        } catch {
          setModalProps({
            title: 'Error',
            message: 'Failed to delete Platform. Please try again.',
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
      <aside className="flex place-items-center justify-end gap-4 bg-neutral-900 p-4">
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
        {/* Platform Cards */}
        <ul className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3">
          {paginatedPlatforms.map((platform, index) => (
            <li
              className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-900 shadow-lg"
              key={index}
            >
              {/* Body */}
              <div className="flex gap-4 p-4">
                <div className="flex flex-col place-items-center gap-2">
                  {/* Picture */}
                  <div className="h-fit border-2 border-neutral-600 p-1">
                    {platform.logo_url ? (
                      <Image
                        src={platform.logo_url!}
                        alt={`${platform.platform_abbrev} Picture`}
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
                      onClick={() => handleUpdateClick(platform)}
                    >
                      <PencilSquareIcon className="h-auto w-4 cursor-pointer text-neutral-400 hover:text-[var(--cel-blue)]" />
                    </button>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleDeletePlatform(platform)}
                      >
                        <TrashIcon className="h-auto w-4 text-neutral-400 hover:text-[var(--cel-red)]" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-neutral-600">
                      Full Title
                    </p>
                    <p className="text-md text-neutral-300">
                      {platform.platform_title}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-neutral-600">
                      Abbreviation
                    </p>
                    <p className="text-md text-neutral-300">
                      {platform.platform_abbrev}
                    </p>
                  </div>
                </div>
              </div>
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
