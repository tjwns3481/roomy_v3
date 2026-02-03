"use client";

import React, { useState } from "react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { ContactForm } from "@/components/settings/ContactForm";
import { PlanCard } from "@/components/settings/PlanCard";
import { User } from "@/types";

// Mock user data - 실제로는 Supabase에서 가져와야 함
const mockUser: User = {
  id: "1",
  clerk_id: "user_mock_clerk_id",
  email: "host@example.com",
  name: "김호스트",
  role: "host",
  avatar_url: null,
  phone: "010-1234-5678",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState("profile");
  const [user, setUser] = useState<User>(mockUser);

  const handleUpdateProfile = async (data: Partial<User>) => {
    // TODO: Supabase API 호출
    console.log("Updating profile:", data);

    // Mock update
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({ ...user, ...data });

    // Show toast notification
    alert("프로필이 저장되었습니다.");
  };

  const handleLogout = async () => {
    // TODO: Supabase logout
    console.log("Logging out...");
    alert("로그아웃되었습니다.");
    // window.location.href = "/login";
  };

  const handleUpgrade = () => {
    // TODO: Navigate to pricing page
    console.log("Navigating to pricing...");
    alert("요금제 페이지로 이동합니다.");
  };

  return (
    <div className="h-screen overflow-hidden flex bg-[#f6f7f8] dark:bg-[#101a22]">
      <SettingsSidebar
        user={user}
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={handleLogout}
      />

      <main className="flex-1 h-full overflow-y-auto bg-[#f6f7f8] dark:bg-[#101a22]">
        <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col gap-8">
          {/* Page Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[#111518] dark:text-white text-3xl font-bold leading-tight">
              계정 설정
            </h1>
            <p className="text-[#617989] dark:text-gray-400 text-base font-normal">
              프로필과 계정 정보를 관리하세요.
            </p>
          </div>

          {/* Content based on active menu */}
          {activeMenu === "profile" && (
            <ProfileForm user={user} onUpdate={handleUpdateProfile} />
          )}

          {activeMenu === "contact" && (
            <ContactForm user={user} onUpdate={handleUpdateProfile} />
          )}

          {activeMenu === "password" && (
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] p-6">
              <h2 className="text-xl font-bold text-[#111518] dark:text-white mb-4">
                비밀번호 변경
              </h2>
              <p className="text-[#617989] dark:text-gray-400">
                비밀번호 변경 기능은 준비 중입니다.
              </p>
            </div>
          )}

          {activeMenu === "plan" && <PlanCard onUpgrade={handleUpgrade} />}

          {/* Spacer for bottom scrolling */}
          <div className="h-10"></div>
        </div>
      </main>
    </div>
  );
}
