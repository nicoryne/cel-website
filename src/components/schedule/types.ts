import { StaticImageData } from 'next/image';

export type FilterState = {
  logo: string | StaticImageData;
  abbrev: string;
  title: string;
};
