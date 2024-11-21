'use client';
import { motion } from 'framer-motion';

export default function WavesDivider() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 24 150 28"
      height={80}
      preserveAspectRatio="none"
      className="absolute bottom-0 w-full"
    >
      <defs>
        <path
          id="wave-path"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        ></path>
      </defs>

      {/* Wave 1 */}
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, -40, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <use
          xlinkHref="#wave-path"
          x="50"
          y="3"
          fill="rgba(255, 255, 255, 0.1)"
        ></use>
      </motion.g>

      {/* Wave 2 */}
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, -60, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <use
          xlinkHref="#wave-path"
          x="50"
          y="0"
          fill="rgba(255, 255, 255, 0.2)"
        ></use>
      </motion.g>

      {/* Wave 3 */}
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, -80, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <use xlinkHref="#wave-path" x="50" y="7" fill="#f0f5f8"></use>
      </motion.g>
    </svg>
  );
}
