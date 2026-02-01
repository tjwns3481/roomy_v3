"use client";

import React, { useState } from "react";
import { User } from "@/types";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ProfileFormProps {
  user: User;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await onUpdate({ name, avatar_url: avatarUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="프로필 정보">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full h-24 w-24 shadow-inner ring-4 ring-gray-50 dark:ring-gray-700"
            style={{
              backgroundImage: avatarUrl
                ? `url(${avatarUrl})`
                : "url(https://via.placeholder.com/96)",
            }}
          />
          <div className="flex flex-col justify-center gap-3 flex-1">
            <div>
              <h3 className="text-[#111518] dark:text-white text-lg font-bold">
                프로필 사진
              </h3>
              <p className="text-[#617989] dark:text-gray-400 text-sm">
                JPG, GIF or PNG. Max size of 800K
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" type="button">
                새 이미지 업로드
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setAvatarUrl("")}
              >
                제거
              </Button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <Input
            label="이름"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            required
          />
          <Input
            label="이메일"
            type="email"
            value={user.email}
            readOnly
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" isLoading={isLoading}>
            저장
          </Button>
        </div>
      </form>
    </Card>
  );
}
