'use client';
import { motion } from 'framer-motion';
import cel_icon from '@/../../public/logos/cel.webp';
import Image from 'next/image';
export default function Loading() {
  return (
    <div className="my-24 w-full bg-transparent p-12">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="mx-auto w-fit"
      >
        <Image
          src={cel_icon}
          alt="Loading Logo"
          className="h-32 w-32"
          width={256}
          height={256}
        />
      </motion.div>
    </div>
  );
}
