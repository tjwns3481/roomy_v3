'use client';

import {
  ContentBlock,
  WifiBlockData,
  RulesBlockData,
  DevicesBlockData,
  PlacesBlockData,
  TextBlockData,
  GalleryBlockData,
  MapBlockData,
} from '@/types';
import { WifiBlock } from './blocks/WifiBlock';
import { RulesBlock } from './blocks/RulesBlock';
import { DevicesBlock } from './blocks/DevicesBlock';
import { PlacesBlock } from './blocks/PlacesBlock';
import { TextBlock } from './blocks/TextBlock';
import { GalleryBlock } from './blocks/GalleryBlock';
import { MapBlock } from './blocks/MapBlock';

interface BlockRendererProps {
  block: ContentBlock;
  slug: string;
}

export function BlockRenderer({ block, slug }: BlockRendererProps) {
  switch (block.type) {
    case 'wifi':
      return <WifiBlock data={block.data as WifiBlockData} />;

    case 'rules':
      return <RulesBlock data={block.data as RulesBlockData} slug={slug} />;

    case 'devices':
      return <DevicesBlock data={block.data as DevicesBlockData} />;

    case 'places':
      return <PlacesBlock data={block.data as PlacesBlockData} slug={slug} />;

    case 'text':
      return <TextBlock data={block.data as TextBlockData} />;

    case 'gallery':
      return <GalleryBlock data={block.data as GalleryBlockData} />;

    case 'map':
      return <MapBlock data={block.data as MapBlockData} />;

    // Unsupported or future block types
    case 'image':
    case 'video':
    case 'contact':
      return null;

    default:
      // Unknown block type - ignore silently
      return null;
  }
}
