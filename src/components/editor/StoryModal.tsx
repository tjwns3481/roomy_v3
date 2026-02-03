"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Story } from "@/types";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (story: Partial<Story>) => void;
  story?: Story | null;
}

export function StoryModal({ isOpen, onClose, onSave, story }: StoryModalProps) {
  const [formData, setFormData] = useState({
    media_url: "",
    label: "",
    media_type: "image" as "image" | "video",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (story) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Form reset when story changes
      setFormData({
        media_url: story.media_url,
        label: story.label || "",
        media_type: story.media_type,
      });
    } else {
      setFormData({
        media_url: "",
        label: "",
        media_type: "image",
      });
    }
    setErrors({});
  }, [story, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.media_url.trim()) {
      newErrors.media_url = "미디어 URL을 입력해주세요.";
    } else {
      try {
        new URL(formData.media_url);
      } catch {
        newErrors.media_url = "올바른 URL 형식이 아닙니다.";
      }
    }

    if (!formData.label.trim()) {
      newErrors.label = "스토리 레이블을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSave({
      ...formData,
      id: story?.id,
      guide_id: story?.guide_id,
      order_index: story?.order_index,
    });

    onClose();
  };

  const handleClose = () => {
    setFormData({
      media_url: "",
      label: "",
      media_type: "image",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={story ? "스토리 수정" : "새 스토리 추가"}
      width="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Media URL */}
        <Input
          label="미디어 URL"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={formData.media_url}
          onChange={(e) =>
            setFormData({ ...formData, media_url: e.target.value })
          }
          error={errors.media_url}
          helperText="이미지 또는 동영상의 URL을 입력하세요"
        />

        {/* Label */}
        <Input
          label="스토리 레이블"
          type="text"
          placeholder="예: 환영합니다"
          value={formData.label}
          onChange={(e) =>
            setFormData({ ...formData, label: e.target.value })
          }
          error={errors.label}
          helperText="스토리 버블 아래에 표시될 텍스트"
        />

        {/* Media Type */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-800 dark:text-white">
            미디어 타입
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, media_type: "image" })}
              className={`
                flex-1 py-3 px-4 rounded-lg border-2 transition-all
                flex items-center justify-center gap-2
                ${
                  formData.media_type === "image"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }
              `}
            >
              <span className="material-symbols-outlined text-blue-500">
                image
              </span>
              <span className="font-medium text-slate-800 dark:text-white">
                이미지
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, media_type: "video" })}
              className={`
                flex-1 py-3 px-4 rounded-lg border-2 transition-all
                flex items-center justify-center gap-2
                ${
                  formData.media_type === "video"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }
              `}
            >
              <span className="material-symbols-outlined text-blue-500">
                videocam
              </span>
              <span className="font-medium text-slate-800 dark:text-white">
                동영상
              </span>
            </button>
          </div>
        </div>

        {/* Preview */}
        {formData.media_url && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-800 dark:text-white">
              미리보기
            </label>
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
              {formData.media_type === "image" ? (
                <img
                  src={formData.media_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <video
                  src={formData.media_url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
          >
            취소
          </Button>
          <Button type="submit" variant="primary">
            {story ? "수정" : "추가"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
