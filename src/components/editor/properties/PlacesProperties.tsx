"use client";

import { ContentBlock, PlacesBlockData, PlaceItem } from "@/types";

interface PlacesPropertiesProps {
  block: ContentBlock;
  onUpdate: (data: Partial<PlacesBlockData>) => void;
}

export function PlacesProperties({ block, onUpdate }: PlacesPropertiesProps) {
  const data = block.data as PlacesBlockData;

  const handleAddPlace = () => {
    const newPlace: PlaceItem = {
      name: "",
      category: "restaurant",
      address: "",
      isHostPick: false,
    };
    onUpdate({ items: [...data.items, newPlace] });
  };

  const handleUpdatePlace = (index: number, updates: Partial<PlaceItem>) => {
    const updatedItems = data.items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    onUpdate({ items: updatedItems });
  };

  const handleDeletePlace = (index: number) => {
    const updatedItems = data.items.filter((_, i) => i !== index);
    onUpdate({ items: updatedItems });
  };

  return (
    <div className="space-y-6">
      {/* Section: Places List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            추천 장소
          </h3>
          <button
            onClick={handleAddPlace}
            className="text-xs font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            장소 추가
          </button>
        </div>
        <div className="space-y-3">
          {data.items.map((place, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-2"
            >
              <div className="flex items-start gap-2">
                <input
                  type="text"
                  value={place.name}
                  onChange={(e) =>
                    handleUpdatePlace(index, { name: e.target.value })
                  }
                  className="flex-1 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2"
                  placeholder="장소 이름"
                />
                <button
                  onClick={() => handleDeletePlace(index)}
                  className="p-1.5 text-slate-400 hover:text-red-500"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    delete
                  </span>
                </button>
              </div>
              <select
                value={place.category}
                onChange={(e) =>
                  handleUpdatePlace(index, {
                    category: e.target.value as PlaceItem["category"],
                  })
                }
                className="w-full text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1.5 px-2"
              >
                <option value="restaurant">식당</option>
                <option value="cafe">카페</option>
                <option value="attraction">관광지</option>
                <option value="etc">기타</option>
              </select>
              <textarea
                value={place.address}
                onChange={(e) =>
                  handleUpdatePlace(index, { address: e.target.value })
                }
                className="w-full text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2 resize-none"
                rows={2}
                placeholder="주소를 입력하세요"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`hostpick-${index}`}
                  checked={place.isHostPick || false}
                  onChange={(e) =>
                    handleUpdatePlace(index, { isHostPick: e.target.checked })
                  }
                  className="rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                />
                <label
                  htmlFor={`hostpick-${index}`}
                  className="text-xs text-slate-600 dark:text-slate-300"
                >
                  호스트 추천
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
