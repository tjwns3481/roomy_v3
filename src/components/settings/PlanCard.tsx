"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface PlanCardProps {
  onUpgrade: () => void;
}

export function PlanCard({ onUpgrade }: PlanCardProps) {
  return (
    <section className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden relative">
      {/* Highlight accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2b9dee]"></div>
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#111518] dark:text-white">
              현재 요금제
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold border border-gray-200 dark:border-gray-600">
              Free 플랜
            </span>
          </div>
          <ul className="flex flex-col sm:flex-row gap-4 text-sm text-[#617989] dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[#2b9dee]"
                style={{ fontSize: "20px" }}
              >
                check_circle
              </span>
              가이드 1개
            </li>
            <li className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[#2b9dee]"
                style={{ fontSize: "20px" }}
              >
                check_circle
              </span>
              기본 기능
            </li>
          </ul>
        </div>
        <Button
          onClick={onUpgrade}
          className="shadow-md shadow-blue-200 dark:shadow-blue-900/20 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
        >
          Pro로 업그레이드
        </Button>
      </div>
    </section>
  );
}
