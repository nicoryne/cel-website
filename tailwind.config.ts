import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // CESAFI ESPORTS LEAGUE Colors
        pale: 'var(--pale)',
        chili: 'var(--chili)',
        yale: 'var(--yale)',
        pearl: 'var(--pearl)',
        navy: 'var(--navy)',
        marine: 'var(--marine)',
        ultramarine: 'var(--ultramarine)',
        federal: 'var(--federal)',
        antiflash: 'var(--antiflash)',
        platinum: 'var(--platinum)',
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      },
      fontFamily: {
        manrope: 'var(--font-manrope)',
        delagothic: 'var(--font-delagothic)'
      },
      backgroundImage: {
        // Custom Gradients
        'hero-gradient': 'linear-gradient(to bottom, var(--pearl), var(--navy), var(--marine))',
        'blue-red-gradient': 'linear-gradient(to right, var(--yale), var(--pale))',
        'red-blue-gradient': 'linear-gradient(to right, var(--pale), var(--yale))'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'class'
};
export default config;
