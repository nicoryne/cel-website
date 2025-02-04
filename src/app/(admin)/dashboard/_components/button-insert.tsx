import { PlusIcon } from '@heroicons/react/20/solid';

type ButtonInsert = {
  onInsert: () => Promise<void>;
};

export default function ButtonInsert({ onInsert }: ButtonInsert) {
  return (
    <button
      type="button"
      className="flex place-items-center space-x-2 rounded-md border-2 border-green-700 bg-green-900 px-3 py-1 hover:border-green-600"
      onClick={onInsert}
    >
      <span>
        <PlusIcon className="h-auto w-3 text-green-600" />
      </span>
      <span className="text-base text-green-100">Insert</span>
    </button>
  );
}
