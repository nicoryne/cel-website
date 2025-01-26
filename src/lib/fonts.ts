import localFont from 'next/font/local';

export const manrope = localFont({
  src: [
    {
      path: '../../public/fonts/Manrope-VariableFont_wght.ttf'
    }
  ],
  variable: '--font-manrope'
});

export const delagothic = localFont({
  src: [
    {
      path: '../../public/fonts/DelaGothicOne-Regular.ttf'
    }
  ],
  variable: '--font-delagothic'
});
