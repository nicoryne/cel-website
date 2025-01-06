import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';

type DateSelectorProps = {
  handleDateButtonPress: (type: 'prev' | 'today' | 'next') => void;
};

export default function DateSelector({
  handleDateButtonPress
}: DateSelectorProps) {
  return (
    <div className="flex place-items-center justify-center">
      {/* Previous Date */}
      <button
        type="button"
        className="bg-neutral-800 p-2 transition-colors duration-150 ease-linear hover:bg-neutral-900"
        onClick={() => handleDateButtonPress('prev')}
      >
        <ArrowLeftIcon className="h-auto w-6 text-white" />
      </button>

      {/* Today */}
      <button
        type="button"
        className="bg-neutral-800 px-4 py-2 transition-colors duration-150 ease-linear hover:bg-neutral-900"
        onClick={() => handleDateButtonPress('today')}
      >
        <span className="text-xs font-semibold uppercase md:text-base">
          Today
        </span>
      </button>

      {/* Next Date */}
      <button
        type="button"
        className="bg-neutral-800 p-2 transition-colors duration-150 ease-linear hover:bg-neutral-900"
        onClick={() => handleDateButtonPress('next')}
      >
        <ArrowRightIcon className="h-auto w-6 text-white" />
      </button>
    </div>
  );
}
