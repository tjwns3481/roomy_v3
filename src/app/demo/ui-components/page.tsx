// @TASK P0-T0.3 - UI 컴포넌트 데모 페이지
// @SPEC specs/shared/components.yaml

"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Card,
  Modal,
  Badge,
  Avatar,
  useToast,
} from "@/components/ui";

export default function UIComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { showToast, ToastContainer } = useToast();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            UI Components Demo
          </h1>
          <p className="text-gray-600">
            specs/shared/components.yaml 기반 기본 UI 컴포넌트
          </p>
        </div>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="kakao">Kakao</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button isLoading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="이름"
              placeholder="홍길동"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="이메일"
              type="email"
              placeholder="example@email.com"
              required
            />
            <Input
              label="비밀번호"
              type="password"
              helperText="8자 이상 입력해주세요"
            />
            <Input
              label="전화번호"
              type="tel"
              error="올바른 전화번호를 입력해주세요"
            />
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default" title="Default Card" subtitle="기본 카드">
              이것은 기본 카드입니다.
            </Card>
            <Card
              variant="elevated"
              title="Elevated Card"
              subtitle="그림자 효과"
            >
              이것은 그림자가 있는 카드입니다.
            </Card>
            <Card variant="outlined" title="Outlined Card" subtitle="테두리">
              이것은 테두리가 있는 카드입니다.
            </Card>
          </div>
        </section>

        {/* Modal */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Modal</h2>
          <Button onClick={() => setIsModalOpen(true)}>모달 열기</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="모달 제목"
          >
            <p className="text-gray-700">
              이것은 모달 컨텐츠입니다. ESC 키를 누르거나 닫기 버튼을 클릭하여
              닫을 수 있습니다.
            </p>
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                취소
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>확인</Button>
            </div>
          </Modal>
        </section>

        {/* Toasts */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Toasts</h2>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() =>
                showToast({ message: "성공했습니다!", variant: "success" })
              }
            >
              Success Toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                showToast({ message: "에러가 발생했습니다.", variant: "error" })
              }
            >
              Error Toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                showToast({
                  message: "주의가 필요합니다.",
                  variant: "warning",
                })
              }
            >
              Warning Toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                showToast({
                  message: "정보를 확인하세요.",
                  variant: "info",
                  action: { label: "확인", onClick: () => alert("확인!") },
                })
              }
            >
              Info Toast (with action)
            </Button>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Badges</h2>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="success" dot>
              With Dot
            </Badge>
          </div>
        </section>

        {/* Avatars */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Avatars</h2>
          <div className="space-y-4">
            <div className="flex gap-2 items-center flex-wrap">
              <Avatar size="xs" name="홍길동" />
              <Avatar size="sm" name="홍길동" />
              <Avatar size="md" name="홍길동" />
              <Avatar size="lg" name="홍길동" />
              <Avatar size="xl" name="홍길동" />
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <Avatar name="홍길동" status="online" />
              <Avatar name="김철수" status="offline" />
              <Avatar name="이영희" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
