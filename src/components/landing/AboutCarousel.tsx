'use client';
import image1 from '@/../public/images/about_1.webp';
import image2 from '@/../public/images/about_2.webp';
import image3 from '@/../public/images/about_3.webp';
import image4 from '@/../public/images/about_4.webp';
import image5 from '@/../public/images/about_5.webp';
import image6 from '@/../public/images/about_6.webp';
import { motion } from 'framer-motion';
import Image from 'next/image';

const imageList = [image1, image2, image3, image4, image5, image6];

export default function AboutCarousel() {
  return (
    <motion.div className="flex flex-row gap-16 overflow-hidden">
      {imageList.map((image, index) => (
        <figure key={index}>
          <Image
            width={1920}
            height={1080}
            src={image}
            alt={`About Image ${index + 1}`}
          />
        </figure>
      ))}
    </motion.div>
  );
}
