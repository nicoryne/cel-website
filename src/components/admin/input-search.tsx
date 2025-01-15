import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';

type InputSearchProps = {
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>;
};

export default function InputSearch({ setSearchFilter }: InputSearchProps) {
  return (
    <div className="flex w-96 gap-2">
      {/* Search */}
      <MagnifyingGlassIcon className="pointer-events-none absolute m-4 h-auto w-4 bg-transparent" />
      <input
        type="text"
        placeholder="Search..."
        name="search"
        id="search"
        className="text-clips w-full rounded-3xl border-2 border-neutral-700 bg-neutral-800 indent-8 text-base transition-colors duration-150 ease-in-out focus:border-neutral-600 focus:ring-0"
        onChange={(e) => setSearchFilter(e.target.value)}
      />
    </div>
  );
}
