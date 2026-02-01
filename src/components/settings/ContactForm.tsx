"use client";

import React, { useState } from "react";
import { User } from "@/types";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ContactFormProps {
  user: User;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

export function ContactForm({ user, onUpdate }: ContactFormProps) {
  const [phone, setPhone] = useState(user.phone || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await onUpdate({ phone });
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="연락처 설정">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
        <Input
          label="휴대폰 번호"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-0000-0000"
          helperText="이 연락처는 가이드 하단에 표시됩니다."
        />

        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <Button type="submit" isLoading={isLoading}>
            저장
          </Button>
        </div>
      </form>
    </Card>
  );
}
