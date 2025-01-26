'use client';

import { motion, MotionProps } from 'framer-motion';
import { OptionHTMLAttributes, SelectHTMLAttributes } from 'react';

interface MotionComponentProps<Tag extends keyof JSX.IntrinsicElements> extends MotionProps {
  type?: Tag;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function MotionComponent<Tag extends keyof JSX.IntrinsicElements>({
  type,
  children,
  className,
  onClick,
  ...motionProps
}: MotionComponentProps<Tag>) {
  const Component = type ? (motion as any)[type] : motion.div;
  return (
    <Component className={className} onClick={onClick} {...motionProps}>
      {children}
    </Component>
  );
}
