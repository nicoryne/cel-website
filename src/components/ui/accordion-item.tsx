'use client';

import MotionComponent from '@/components/ui/motion-component';

interface AccordionItemProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function AccordionItem({ children, onClick }: AccordionItemProps) {
  return (
    <MotionComponent
      type="button"
      className={`relative w-full bg-background`}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      onClick={onClick}
    >
      {children}
    </MotionComponent>
  );
}
