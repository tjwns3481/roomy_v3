"use client";

import { ContentBlock, DevicesBlockData, DeviceItem } from "@/types";

interface DevicesPropertiesProps {
  block: ContentBlock;
  onUpdate: (data: Partial<DevicesBlockData>) => void;
}

export function DevicesProperties({
  block,
  onUpdate,
}: DevicesPropertiesProps) {
  const data = block.data as DevicesBlockData;

  const handleAddDevice = () => {
    const newDevice: DeviceItem = {
      name: "",
      description: "",
    };
    onUpdate({ items: [...data.items, newDevice] });
  };

  const handleUpdateDevice = (index: number, updates: Partial<DeviceItem>) => {
    const updatedItems = data.items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    onUpdate({ items: updatedItems });
  };

  const handleDeleteDevice = (index: number) => {
    const updatedItems = data.items.filter((_, i) => i !== index);
    onUpdate({ items: updatedItems });
  };

  return (
    <div className="space-y-6">
      {/* Section: Devices List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            기기 목록
          </h3>
          <button
            onClick={handleAddDevice}
            className="text-xs font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            기기 추가
          </button>
        </div>
        <div className="space-y-3">
          {data.items.map((device, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-2"
            >
              <div className="flex items-start gap-2">
                <input
                  type="text"
                  value={device.name}
                  onChange={(e) =>
                    handleUpdateDevice(index, { name: e.target.value })
                  }
                  className="flex-1 text-sm font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2"
                  placeholder="기기 이름"
                />
                <button
                  onClick={() => handleDeleteDevice(index)}
                  className="p-1.5 text-slate-400 hover:text-red-500"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    delete
                  </span>
                </button>
              </div>
              <textarea
                value={device.description}
                onChange={(e) =>
                  handleUpdateDevice(index, { description: e.target.value })
                }
                className="w-full text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2 resize-none"
                rows={2}
                placeholder="사용법을 입력하세요"
              />
              {device.imageUrl !== undefined && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    이미지 URL (선택)
                  </label>
                  <input
                    type="url"
                    value={device.imageUrl || ""}
                    onChange={(e) =>
                      handleUpdateDevice(index, { imageUrl: e.target.value })
                    }
                    className="w-full text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
