'use client';

import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import MotionComponent from '@/components/ui/motion-component';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/16/solid';

interface AccordionProps {
  children: React.ReactNode;
  value?: string;
}
export default function Accordion({ children, value }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-10 inline-block w-full">
      <button
        className="flex h-full w-full items-center justify-between gap-4 rounded-sm px-6 py-3 active:bg-neutral-50 dark:border-2 dark:border-neutral-900 active:dark:bg-neutral-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl font-bold uppercase">{value}</span>
        {isOpen ? <ArrowUpIcon className="h-auto w-6" /> : <ArrowDownIcon className="h-auto w-6" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <MotionComponent
            type="div"
            className="mt-2 rounded shadow-lg"
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
