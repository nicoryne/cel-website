'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MotionComponent from '@/components/ui/motion-component';
import { Bars3BottomLeftIcon } from '@heroicons/react/16/solid';
import Image, { StaticImageData } from 'next/image';

interface DropdownProps {
  children: React.ReactNode;
  value?: string;
  image?: string | StaticImageData;
}

export default function Dropdown({ children, value, image }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block w-full">
      <button
        className="flex items-center gap-4 rounded-sm border-l-2 border-neutral-200 px-6 py-3 shadow-sm transition-all duration-300 ease-in-out hover:border-pale"
        onClick={() => setIsOpen(!isOpen)}
      >
        {image && (
          <Image src={image} className="h-auto w-6" alt={`${value} Logo`} width={32} height={32} />
        )}
        {value}
        <Bars3BottomLeftIcon className="h-auto w-4 fill-neutral-400" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <MotionComponent
            type="div"
            className="no-scrollbar absolute left-0 mt-4 h-fit scroll-m-1 overflow-y-scroll rounded bg-background shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {children}
          </MotionComponent>
        )}
      </AnimatePresence>
    </div>
  );
}
