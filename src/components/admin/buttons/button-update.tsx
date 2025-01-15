import { PencilSquareIcon } from '@heroicons/react/20/solid';

type ButtonUpdateProps = {
  onUpdate: () => void;
};

export default function ButtonUpdate({ onUpdate }: ButtonUpdateProps) {
  return (
    <button type="button" onClick={onUpdate}>
      <PencilSquareIcon className="h-auto w-4 cursor-pointer text-neutral-400 hover:text-[var(--cel-blue)]" />
    </button>
  );
}
