'use client';

import { useState } from 'react';
import { BlockList } from '@/components/editor';
import { ContentBlock } from '@/types';

export default function BlocksDemoPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    {
      id: 'block-1',
      type: 'wifi',
      order: 0,
      data: {
        ssid: 'MyWiFi',
        password: '12345678',
        note: '로비에서만 사용 가능합니다.',
      },
    },
    {
      id: 'block-2',
      type: 'text',
      order: 1,
      data: {
        title: '환영합니다',
        content: '저희 숙소에 오신 것을 환영합니다!',
      },
    },
    {
      id: 'block-3',
      type: 'rules',
      order: 2,
      data: {
        checkIn: '15:00',
        checkOut: '11:00',
        items: ['금연', '반려동물 동반 불가', '파티 금지'],
      },
    },
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Block CRUD Demo
          </h1>
          <p className="text-gray-600">
            블록을 드래그하여 순서를 변경하고, 추가/삭제/복제할 수 있습니다.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <BlockList
            blocks={blocks}
            onBlocksChange={setBlocks}
            onBlockSelect={setSelectedBlockId}
            selectedBlockId={selectedBlockId}
          />
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold text-gray-900 mb-2">
            Debug: Current State
          </h2>
          <div className="text-xs">
            <p className="mb-1">
              Total Blocks: <strong>{blocks.length}</strong>
            </p>
            <p className="mb-1">
              Selected Block:{' '}
              <strong>{selectedBlockId || 'None'}</strong>
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                View Blocks JSON
              </summary>
              <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                {JSON.stringify(blocks, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
