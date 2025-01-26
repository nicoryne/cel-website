import { TrashIcon } from '@heroicons/react/20/solid';

type ButtonDeleteProps = {
  onDelete: () => void;
};

export default function ButtonDelete({ onDelete }: ButtonDeleteProps) {
  return (
    <button type="button" onClick={onDelete}>
      <TrashIcon className="h-auto w-4 text-neutral-400 hover:text-[var(--cel-red)]" />
    </button>
  );
}
