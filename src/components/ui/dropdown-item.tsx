'use client';

import MotionComponent from '@/components/ui/motion-component';

interface DropdownItemProps {
  children?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

export default function DropdownItem({ children, onClick, selected }: DropdownItemProps) {
  return (
    <MotionComponent
      type="button"
      className={`relative w-full border-l-2 bg-background p-4 transition-colors duration-300 ease-in-out hover:border-chili ${selected ? 'border-neutral-400' : 'border-neutral-600'}`}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      onClick={onClick}
    >
      {children}
    </MotionComponent>
  );
}
