'use client';

import { GamePlatform } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PlatformLinksProps {
  platforms: GamePlatform[];
}

export default function PlatformLinks({ platforms }: PlatformLinksProps) {
  const path = usePathname();

  const basePath = path?.match(/^\/standings\/[^/]+\/[^/]+\//)?.[0];

  const currentPlatform = path?.match(/^\/standings\/[^/]+\/[^/]+\/([^/]+)\/[^/]+$/)?.[1];

  const leagueStage = path?.match(/^\/standings\/[^/]+\/[^/]+\/[^/]+\/([^/]+)$/)?.[1];

  return (
    <>
      {platforms.map((platform, index) => {
        const isSelected = platform.platform_abbrev.toLowerCase() === currentPlatform;
        return (
          <li key={index}>
            <Link
              href={`${basePath}${platform.platform_abbrev.toLowerCase()}/${leagueStage}`}
              className={`${isSelected ? `${platform.platform_abbrev === 'MLBB' ? 'border-l-federal' : 'border-l-chili'}` : 'border-l-neutral-600'} ${platform.platform_abbrev === 'MLBB' ? 'hover:text-yale' : 'hover:text-pale'} flex gap-4 border-l-2 px-2 py-2 text-xs font-bold uppercase shadow-sm transition-all duration-300 ease-in-out md:px-4 md:text-sm`}
            >
              <Image
                src={platform.logo_url}
                alt={`${platform.platform_abbrev} Logo`}
                width={64}
                height={64}
                className="h-auto w-4 md:w-6"
              />
              {platform.platform_abbrev}
            </Link>
          </li>
        );
      })}
    </>
  );
}
