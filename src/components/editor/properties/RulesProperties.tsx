"use client";

import { useState, useEffect, useRef } from "react";
import { ContentBlock, RulesBlockData, RuleItem } from "@/types";

// 규칙에 적합한 아이콘 목록
const RULE_ICONS = [
  { name: "check_circle", label: "체크" },
  { name: "smoke_free", label: "금연" },
  { name: "pets", label: "반려동물" },
  { name: "volume_off", label: "소음금지" },
  { name: "schedule", label: "시간" },
  { name: "warning", label: "주의" },
  { name: "info", label: "안내" },
  { name: "cleaning_services", label: "청소" },
  { name: "lock", label: "보안" },
  { name: "key", label: "열쇠" },
  { name: "directions_car", label: "주차" },
  { name: "wifi", label: "와이파이" },
  { name: "thermostat", label: "온도" },
  { name: "delete", label: "쓰레기" },
  { name: "local_laundry_service", label: "세탁" },
  { name: "kitchen", label: "주방" },
  { name: "group", label: "인원" },
  { name: "child_care", label: "어린이" },
  { name: "celebration", label: "파티" },
  { name: "photo_camera", label: "촬영" },
];

interface RulesPropertiesProps {
  block: ContentBlock;
  onUpdate: (data: Partial<RulesBlockData>) => void;
}

export function RulesProperties({ block, onUpdate }: RulesPropertiesProps) {
  const data = block.data as RulesBlockData;
  const [openIconPicker, setOpenIconPicker] = useState<string | null>(null);
  const iconPickerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 아이콘 선택기 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        iconPickerRef.current &&
        !iconPickerRef.current.contains(event.target as Node)
      ) {
        setOpenIconPicker(null);
      }
    };

    if (openIconPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openIconPicker]);

  const handleAddRule = () => {
    const newRule: RuleItem = {
      id: `rule-${Date.now()}`,
      text: "",
      icon: "check_circle",
      category: "guide",
    };
    onUpdate({ items: [...data.items, newRule] });
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<RuleItem>) => {
    const updatedItems = data.items.map((item) =>
      item.id === ruleId ? { ...item, ...updates } : item
    );
    onUpdate({ items: updatedItems });
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedItems = data.items.filter((item) => item.id !== ruleId);
    onUpdate({ items: updatedItems });
  };

  return (
    <div className="space-y-6">
      {/* Section: Check-in/out Times */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          체크인/아웃 시간
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              체크인
            </label>
            <input
              type="time"
              value={data.checkIn}
              onChange={(e) => onUpdate({ checkIn: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              체크아웃
            </label>
            <input
              type="time"
              value={data.checkOut}
              onChange={(e) => onUpdate({ checkOut: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      {/* Section: Rules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            이용 규칙
          </h3>
          <button
            onClick={handleAddRule}
            className="text-xs font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            규칙 추가
          </button>
        </div>
        <div className="space-y-2">
          {data.items.map((rule) => (
            <div
              key={rule.id}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-2"
            >
              <div className="flex items-start gap-2">
                <input
                  type="text"
                  value={rule.text}
                  onChange={(e) =>
                    handleUpdateRule(rule.id, { text: e.target.value })
                  }
                  className="flex-1 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2"
                  placeholder="규칙을 입력하세요"
                />
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    delete
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                {/* Icon Picker */}
                <div className="relative" ref={openIconPicker === rule.id ? iconPickerRef : null}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIconPicker(
                        openIconPicker === rule.id ? null : rule.id
                      )
                    }
                    className="flex items-center gap-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-2 hover:border-blue-400"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {rule.icon || "check_circle"}
                    </span>
                    <span className="material-symbols-outlined text-[12px] text-slate-400">
                      expand_more
                    </span>
                  </button>
                  {openIconPicker === rule.id && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2 w-[240px]">
                      <div className="grid grid-cols-5 gap-1">
                        {RULE_ICONS.map((icon) => (
                          <button
                            key={icon.name}
                            type="button"
                            onClick={() => {
                              handleUpdateRule(rule.id, { icon: icon.name });
                              setOpenIconPicker(null);
                            }}
                            className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center ${
                              rule.icon === icon.name
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                                : "text-slate-600 dark:text-slate-300"
                            }`}
                            title={icon.label}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {icon.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Category Selector */}
                <select
                  value={rule.category || "guide"}
                  onChange={(e) =>
                    handleUpdateRule(rule.id, {
                      category: e.target.value as RuleItem["category"],
                    })
                  }
                  className="text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-2"
                >
                  <option value="checkin">체크인</option>
                  <option value="guide">안내</option>
                  <option value="notice">주의사항</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
