'use client';

import { useState } from 'react';
import {
  EditorSection,
  EditorField,
  EditorInput,
  EditorTextarea,
  EditorButtonGroup,
  EditorPreview
} from '@/components/editor/ui';

export default function EditorUIDemo() {
  const [title, setTitle] = useState('안녕하세요!');
  const [description, setDescription] = useState('새로운 에디터 UI 컴포넌트를 소개합니다.');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [alignment, setAlignment] = useState('left');
  const [size, setSize] = useState('md');

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !value.includes('@')) {
      setEmailError('올바른 이메일 형식이 아닙니다');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            에디터 UI 컴포넌트 데모
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            통일된 에디터 레이아웃 시스템의 모든 컴포넌트를 확인해보세요
          </p>
        </div>

        <div className="space-y-8">
          {/* 기본 폼 */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <EditorSection
              title="기본 정보"
              description="에디터의 기본 입력 컴포넌트를 확인하세요"
            >
              <EditorField
                label="제목"
                htmlFor="demo-title"
                required
                icon="title"
                hint="최대 100자"
              >
                <EditorInput
                  id="demo-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  leftIcon="title"
                />
              </EditorField>

              <EditorField
                label="설명"
                htmlFor="demo-description"
                icon="description"
              >
                <EditorTextarea
                  id="demo-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="설명을 입력하세요"
                  rows={4}
                />
              </EditorField>

              <EditorField
                label="이메일"
                htmlFor="demo-email"
                required
                icon="mail"
                error={emailError}
                hint={!emailError ? '알림을 받을 이메일을 입력하세요' : undefined}
              >
                <EditorInput
                  id="demo-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="email@example.com"
                  leftIcon="mail"
                  error={!!emailError}
                />
              </EditorField>
            </EditorSection>

            <EditorSection
              title="스타일 옵션"
              description="버튼 그룹을 이용한 선택 UI"
              className="mt-6"
            >
              <EditorField label="텍스트 정렬" icon="format_align_left">
                <EditorButtonGroup
                  options={[
                    { value: 'left', label: '왼쪽', icon: 'format_align_left' },
                    { value: 'center', label: '가운데', icon: 'format_align_center' },
                    { value: 'right', label: '오른쪽', icon: 'format_align_right' },
                  ]}
                  value={alignment}
                  onChange={setAlignment}
                  columns={3}
                />
              </EditorField>

              <EditorField label="글자 크기" icon="format_size">
                <EditorButtonGroup
                  options={[
                    { value: 'sm', label: '작게' },
                    { value: 'md', label: '보통' },
                    { value: 'lg', label: '크게' },
                    { value: 'xl', label: '매우 크게' },
                  ]}
                  value={size}
                  onChange={setSize}
                  columns={4}
                />
              </EditorField>
            </EditorSection>

            <EditorPreview title="게스트 화면 미리보기">
              <div
                className={`
                  ${alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left'}
                `}
              >
                <h3
                  className={`
                    font-bold text-slate-900 dark:text-slate-100 mb-2
                    ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'}
                  `}
                >
                  {title || '제목 없음'}
                </h3>
                <p
                  className={`
                    text-slate-600 dark:text-slate-400
                    ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : size === 'lg' ? 'text-lg' : 'text-xl'}
                  `}
                >
                  {description || '설명 없음'}
                </p>
                {email && !emailError && (
                  <p className="mt-3 text-xs text-slate-400 flex items-center gap-1 justify-center">
                    <span className="material-symbols-outlined text-[14px]">mail</span>
                    {email}
                  </p>
                )}
              </div>
            </EditorPreview>
          </div>

          {/* 컴포넌트 목록 */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              사용 가능한 컴포넌트
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'EditorSection', icon: 'view_module', desc: '섹션 구분' },
                { name: 'EditorField', icon: 'label', desc: '라벨 + 입력' },
                { name: 'EditorInput', icon: 'text_fields', desc: '텍스트 입력' },
                { name: 'EditorTextarea', icon: 'notes', desc: '긴 텍스트 입력' },
                { name: 'EditorButtonGroup', icon: 'radio_button_checked', desc: '선택 버튼' },
                { name: 'EditorPreview', icon: 'visibility', desc: '미리보기' },
              ].map((component) => (
                <div
                  key={component.name}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    {component.icon}
                  </span>
                  <div>
                    <p className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">
                      {component.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {component.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
