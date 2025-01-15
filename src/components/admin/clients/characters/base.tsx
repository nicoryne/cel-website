'use client';

import { CharacterWithDetails, Character } from '@/lib/types';
import React from 'react';
import Image from 'next/image';
import Modal, { ModalProps } from '@/components/modal';
import PaginationControls from '@/components/admin/pagination';
import ButtonInsert from '@/components/admin/buttons/button-insert';
import ButtonUpdate from '@/components/admin/buttons/button-update';
import ButtonDelete from '@/components/admin/buttons/button-delete';
import InputSearch from '@/components/admin/input-search';
import {
  addCharacterToCache,
  fetchCharactersByIndexRange,
  fetchCharacterByStringFilter,
  getFilteredCharacters,
  handleDelete,
  handleInsert,
  handleUpdate
} from '@/components/admin/clients/characters/utils';

type CharactersClientBaseProps = {
  charactersCount: Promise<number | null>;
};

const ITEMS_PER_PAGE = 10;

export default function CharactersClientBase({ charactersCount }: CharactersClientBaseProps) {
  // Retrieving count from Promise
  const processedCharactersCount = React.use(charactersCount);
  const formData = React.useRef<Partial<Character>>({});

  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [cachedCharacters, setCachedCharacters] = React.useState<CharacterWithDetails[]>([]);
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);
  const [searchFilter, setSearchFilter] = React.useState<string>('');

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Setting Total Items & Pages
  React.useEffect(() => {
    if (processedCharactersCount) {
      setTotalItems(processedCharactersCount);
    }

    if (processedCharactersCount && cachedCharacters.length > processedCharactersCount) {
      setTotalItems(cachedCharacters.length);
    }
  }, [processedCharactersCount, cachedCharacters]);

  const fetchCharactersByPage = async (page: number) => {
    const min = (page - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;
    const characterList = await fetchCharactersByIndexRange(min, max);

    characterList.forEach((character) => {
      addCharacterToCache(character, setCachedCharacters);
    });
  };

  // Fetch Character
  React.useEffect(() => {
    const loadCurrentAndPrefetchNext = async (page: number) => {
      await fetchCharactersByPage(page);

      if (page < totalPages) {
        setTimeout(() => {
          loadCurrentAndPrefetchNext(page + 1);
        }, 500);
      }
    };

    loadCurrentAndPrefetchNext(1);
  }, [totalPages]);

  // Filter if not in cache
  const fetchCharactersByName = async () => {
    const character = await fetchCharacterByStringFilter(searchFilter);

    if (character) {
      addCharacterToCache(character, setCachedCharacters);
    }
  };

  const paginatedCharacters = React.useMemo(() => {
    const filtered = getFilteredCharacters(cachedCharacters, searchFilter);

    if (searchFilter.length > 0) {
      fetchCharactersByName();
    }

    const min = (currentPage - 1) * ITEMS_PER_PAGE;
    const max = min + ITEMS_PER_PAGE;

    return filtered.slice(min, max);
  }, [cachedCharacters, currentPage, searchFilter]);

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
      <aside className="flex place-items-center justify-between gap-16 bg-transparent p-4 px-8">
        {/* Insert */}
        <InputSearch setSearchFilter={setSearchFilter} />
        <ButtonInsert onInsert={() => handleInsert(setModalProps, formData, setCachedCharacters)} />
      </aside>
      {/* End of Controls */}

      {/* Content */}
      <div className="h-[80vh] w-full px-8">
        <div className="relative overflow-x-auto border-2 border-neutral-800 sm:rounded-lg">
          <table className="w-full table-auto">
            <thead className="bg-neutral-900">
              <tr className="text-left">
                <th scope="col" className="px-4 py-6">
                  #
                </th>
                <th scope="col" className="px-4 py-6">
                  Game
                </th>
                <th scope="col" className="px-8 py-6">
                  Name
                </th>
                <th scope="col" className="px-8 py-6">
                  Role
                </th>
                <th scope="col" className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedCharacters.map((character, index) => (
                <tr className="border-b-2 border-neutral-900 text-left" key={index}>
                  <td className="whitespace-nowrap px-4 py-3 font-thin">
                    {(index + 1 + (currentPage - 1) * ITEMS_PER_PAGE).toString().padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3">
                    <Image
                      src={character.platform?.logo_url!}
                      alt={`${character.platform?.platform_abbrev} Logo`}
                      height={32}
                      width={32}
                    />
                  </td>
                  <td className="px-8 py-3 font-thin">{character.name}</td>
                  <td className="px-8 py-3 font-thin">{character.role}</td>
                  <td className="px-2 py-3">
                    <div className="flex gap-8">
                      <ButtonUpdate
                        onUpdate={() => handleUpdate(setModalProps, formData, character, setCachedCharacters)}
                      />
                      <ButtonDelete onDelete={() => handleDelete(setModalProps, character, setCachedCharacters)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* End of Content */}
      <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
    </>
  );
}
