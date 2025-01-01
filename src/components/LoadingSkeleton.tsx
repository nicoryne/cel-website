'use client';
import { motion } from 'framer-motion';
import cel_icon from '@/../../public/logos/cel.webp';
import Image from 'next/image';
export default function LoadingSkeleton() {
  return (
    <motion.div
      className="absolute left-1/2 z-40 -translate-x-1/2 transform"
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Image
        src={cel_icon}
        alt="Loading Logo"
        className="h-32 w-32"
        width={256}
        height={256}
      />
    </motion.div>
  );
}
