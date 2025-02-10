'use client';

import { SeasonInfo } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface StageLinksProps {
  stages: string[];
}

export default function StageLinks({ stages }: StageLinksProps) {
  const path = usePathname();

  const basePath = path?.match(/^\/standings\/[^/]+\/[^/]+\/[^/]+\//)?.[0];

  const currentStage = path?.match(/^\/standings\/[^/]+\/[^/]+\/[^/]+\/([^/]+)$/)?.[1];

  return (
    <>
      {stages.map((stage, index) => {
        const isSelected = stage.toLowerCase() === currentStage;
        return (
          <li key={index}>
            <Link
              href={`${basePath}${stage.toLowerCase()}`}
              className={`${isSelected ? 'border-l-ultramarine' : 'border-l-neutral-600'} border-l-2 px-4 py-2 text-xs font-bold uppercase shadow-sm transition-all duration-300 ease-in-out hover:text-yale md:px-4`}
            >
              {stage}
            </Link>
          </li>
        );
      })}
    </>
  );
}
