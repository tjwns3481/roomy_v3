'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const QRModal = dynamic(() => import('./QRModal').then(mod => ({ default: mod.QRModal })), {
  ssr: false,
  loading: () => null,
});

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide: {
    id: string;
    slug: string;
    title: string;
  };
}

export default function DynamicQRModal(props: QRModalProps) {
  if (!props.isOpen) return null;

  return (
    <Suspense fallback={null}>
      <QRModal {...props} />
    </Suspense>
  );
}
