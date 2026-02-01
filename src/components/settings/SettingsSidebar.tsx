"use client";

import React from "react";
import { User } from "@/types";

interface SettingsSidebarProps {
  user: User;
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: "profile", label: "프로필 정보", icon: "person" },
  { id: "contact", label: "연락처 설정", icon: "call" },
  { id: "password", label: "비밀번호 변경", icon: "lock" },
  { id: "plan", label: "요금제", icon: "credit_card" },
];

export function SettingsSidebar({
  user,
  activeMenu,
  onMenuChange,
  onLogout,
}: SettingsSidebarProps) {
  return (
    <aside className="w-72 bg-white dark:bg-[#1a2632] flex flex-col border-r border-[#e5e7eb] dark:border-[#2d3748] h-full shrink-0">
      <div className="flex flex-col h-full p-4">
        {/* Profile Header */}
        <div className="flex gap-3 items-center p-2 mb-6">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shadow-sm"
            style={{
              backgroundImage: user.avatar_url
                ? `url(${user.avatar_url})`
                : "url(https://via.placeholder.com/48)",
            }}
          />
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-[#111518] dark:text-white text-base font-bold leading-normal truncate">
              {user.name || "사용자"}
            </h1>
            <p className="text-[#617989] dark:text-gray-400 text-sm font-normal leading-normal truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left
                ${
                  activeMenu === item.id
                    ? "bg-[#2b9dee]/10 text-[#2b9dee]"
                    : "hover:bg-[#f0f3f4] dark:hover:bg-[#2d3748] text-[#617989] dark:text-gray-300"
                }
              `}
            >
              <span
                className={`material-symbols-outlined ${
                  activeMenu === item.id ? "text-[#2b9dee]" : ""
                }`}
                style={{ fontSize: "24px" }}
              >
                {item.icon}
              </span>
              <p
                className={`text-sm ${
                  activeMenu === item.id
                    ? "font-semibold"
                    : "font-medium text-[#111518] dark:text-gray-200"
                }`}
              >
                {item.label}
              </p>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-4 border-t border-[#e5e7eb] dark:border-[#2d3748]">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[#617989] dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
              logout
            </span>
            <p className="text-sm font-medium leading-normal">로그아웃</p>
          </button>
        </div>
      </div>
    </aside>
  );
}
