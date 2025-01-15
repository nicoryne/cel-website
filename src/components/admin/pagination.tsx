import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 py-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`rounded px-3 py-1 ${
            currentPage === 1
              ? 'bg-neutral-800 text-neutral-500'
              : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <ChevronLeftIcon className="h-auto w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`rounded-lg px-3 py-1 ${
              page === currentPage
                ? 'bg-[var(--cel-blue)] text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
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
              ? 'bg-neutral-800 text-neutral-500'
              : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <ChevronRightIcon className="h-auto w-4" />
        </button>
      </div>
    </>
  );
}
