"use client";

import { useRouter } from "next/navigation";
import { templates } from "@/data/templates";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { useState } from "react";

export default function TemplatesPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectTemplate = async (templateId: string) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      // 선택한 템플릿으로 새 가이드 생성
      const response = await fetch("/api/guides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id: templateId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create guide");
      }

      const result = await response.json();

      // 에디터 페이지로 이동
      router.push(`/editor/${result.data.id}`);
    } catch (error) {
      console.error("Error creating guide:", error);
      alert("가이드 생성에 실패했습니다. 다시 시도해주세요.");
      setIsCreating(false);
    }
  };

  const handleBlankStart = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      // 빈 가이드 생성
      const response = await fetch("/api/guides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create guide");
      }

      const result = await response.json();

      // 에디터 페이지로 이동
      router.push(`/editor/${result.data.id}`);
    } catch (error) {
      console.error("Error creating guide:", error);
      alert("가이드 생성에 실패했습니다. 다시 시도해주세요.");
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <button
            onClick={() => router.back()}
            className="mb-4 text-sm font-medium text-gray-600 hover:text-black"
          >
            ← 뒤로
          </button>
          <h1 className="text-3xl font-bold">Roomy</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Page Title */}
        <div className="mb-12">
          <h2 className="mb-3 text-4xl font-bold">템플릿을 선택하세요</h2>
          <p className="text-lg text-gray-600">
            숙소 유형에 맞는 템플릿으로 빠르게 시작하세요
          </p>
        </div>

        {/* Template Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelectTemplate}
            />
          ))}
        </div>

        {/* Blank Start Link */}
        <div className="flex justify-center">
          <button
            onClick={handleBlankStart}
            disabled={isCreating}
            className="text-base font-medium text-gray-600 underline underline-offset-4 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreating ? "생성 중..." : "빈 페이지로 시작하기"}
          </button>
        </div>
      </main>
    </div>
  );
}
