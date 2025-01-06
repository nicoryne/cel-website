import React from 'react';
import DateSelector from '@/components/schedule/date-selector';
import PlatformFilter from '@/components/schedule/platform-filter';
import { FilterState } from '@/components/schedule/types';

type ControlPanelProps = {
  currentDate: Date;
  handleDateButtonPress: (type: 'prev' | 'today' | 'next') => void;
  platformOptions: FilterState[];
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  menuFilterState: boolean;
  toggleMenuFilter: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ControlPanel({
  currentDate,
  handleDateButtonPress,
  platformOptions,
  filterState,
  setFilterState,
  menuFilterState,
  toggleMenuFilter
}: ControlPanelProps) {
  return (
    <aside className="fixed left-0 right-0 top-20 z-40 mx-auto h-24 border-t-2 border-neutral-800">
      {/* Container */}
      <div className="mx-auto rounded-b-md bg-[#121212] px-8 md:w-[800px] lg:w-[1100px]">
        {/* Wrapper */}
        <div className="flex flex-col gap-4 py-4">
          <div className="flex place-items-center justify-between">
            {/* Time Group */}
            <div className="flex flex-col uppercase">
              {/* Month and Numeric Date */}
              <span className="text-xl font-bold md:text-4xl">
                {currentDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {/* 'Today' and Weekday Long */}
              <span className="text-sm md:text-base">
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long'
                })}
              </span>
            </div>
            {/* End of Time Group */}
            {/* Date Selector Buttons */}
            <DateSelector handleDateButtonPress={handleDateButtonPress} />
            {/* End of Date Selector Buttons */}
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            {/* Platform Filter */}
            <PlatformFilter
              platformOptions={platformOptions}
              filterState={filterState}
              setFilterState={setFilterState}
              menuFilterState={menuFilterState}
              toggleMenuFilter={toggleMenuFilter}
            />
            {/* End of Platform Filter */}
          </div>
        </div>
        {/* End of Wrapper */}
      </div>
      {/* End of Container */}
    </aside>
  );
}
