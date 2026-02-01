'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ContentBlock } from '@/types';

// Block Skeleton
const BlockSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-100 rounded"></div>
      <div className="h-4 bg-gray-100 rounded"></div>
      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
    </div>
  </div>
);

// Dynamic Block Imports
const WifiBlock = dynamic(
  () => import('./blocks/WifiBlock').then(mod => ({ default: mod.WifiBlock })),
  { ssr: false, loading: () => <BlockSkeleton /> }
);

const RulesBlock = dynamic(
  () => import('./blocks/RulesBlock').then(mod => ({ default: mod.RulesBlock })),
  { ssr: false, loading: () => <BlockSkeleton /> }
);

const DevicesBlock = dynamic(
  () => import('./blocks/DevicesBlock').then(mod => ({ default: mod.DevicesBlock })),
  { ssr: false, loading: () => <BlockSkeleton /> }
);

const PlacesBlock = dynamic(
  () => import('./blocks/PlacesBlock').then(mod => ({ default: mod.PlacesBlock })),
  { ssr: false, loading: () => <BlockSkeleton /> }
);

const TextBlock = dynamic(
  () => import('./blocks/TextBlock').then(mod => ({ default: mod.TextBlock })),
  { ssr: false, loading: () => <BlockSkeleton /> }
);

const GalleryBlock = dynamic(
  () => import('./blocks/GalleryBlock').then(mod => ({ default: mod.GalleryBlock })),
  { ssr: false, loading: () => <BlockSkeleton /> }
);

interface DynamicBlockRendererProps {
  block: ContentBlock;
  slug: string;
}

export function DynamicBlockRenderer({ block, slug }: DynamicBlockRendererProps) {
  return (
    <Suspense fallback={<BlockSkeleton />}>
      {(() => {
        switch (block.type) {
          case 'wifi':
            return <WifiBlock data={block.data as any} />;

          case 'rules':
            return <RulesBlock data={block.data as any} slug={slug} />;

          case 'devices':
            return <DevicesBlock data={block.data as any} />;

          case 'places':
            return <PlacesBlock data={block.data as any} slug={slug} />;

          case 'text':
            return <TextBlock data={block.data as any} />;

          case 'gallery':
            return <GalleryBlock data={block.data as any} />;

          // Unsupported or future block types
          case 'image':
          case 'video':
          case 'map':
          case 'contact':
            return null;

          default:
            return null;
        }
      })()}
    </Suspense>
  );
}
