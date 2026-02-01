'use client';

import { ContentBlock } from '@/types';
import { WifiBlock } from './blocks/WifiBlock';
import { RulesBlock } from './blocks/RulesBlock';
import { DevicesBlock } from './blocks/DevicesBlock';
import { PlacesBlock } from './blocks/PlacesBlock';
import { TextBlock } from './blocks/TextBlock';
import { GalleryBlock } from './blocks/GalleryBlock';

interface BlockRendererProps {
  block: ContentBlock;
  slug: string;
}

export function BlockRenderer({ block, slug }: BlockRendererProps) {
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
      // Unknown block type - ignore silently
      return null;
  }
}
