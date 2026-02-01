// @TASK P7-PowerQA - 회원가입 폼 컴포넌트
// @DESIGN design/08-signup.html

"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SignupFormProps {
  onSubmit?: (email: string, password: string, name: string) => Promise<void>;
}

export const SignupForm = ({ onSubmit }: SignupFormProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 클라이언트 유효성 검사
    if (!email || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!termsAgreed) {
      setError("이용약관 및 개인정보처리방침에 동의해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      if (onSubmit) {
        await onSubmit(email, password, name);
      } else {
        // TODO: useAuth 훅 연결
        console.log("회원가입:", { email, name });
        // 임시로 dashboard로 이동
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google 회원가입 시도");
  };

  const handleKakaoSignup = () => {
    console.log("Kakao 회원가입 시도");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Layer with Image and Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Architectural Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBxaTsBOo8A33JC5OL_uvC9UF5ckyIKNMe6NG7jofeXZbXuSso2Qo3sQYEF-CfdcmmrRsJCLf0NisPUlzwxPpSThBalUGLcmHcCLdZZNB88n_t01B_tLrwJLLkJUCYou3IRVQ6UyoMlTw7rEcC8BBubfUklNKEA_rthbScQqlPXV0lDvxXyOe9NAjQlrRi4CAemVruOyJ96sCG8jPOJ3ONYOVnDuvdo__1Hy7uDYQ8n0PWg5pUci1myThlI7N9_1iG2ayh7LLnMghs")'
          }}
        />
        {/* Heavy Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-[#f5f7f8]/85 to-white/60 dark:from-[#101922]/95 dark:via-[#101922]/90 dark:to-[#101922]/80 backdrop-blur-[2px]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[480px] p-4">
        {/* Central Card */}
        <div className="bg-white dark:bg-[#1a2632] rounded-[24px] shadow-2xl p-8 md:p-10 w-full flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-2">
            {/* Brand Logo */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0d7ff2]/10 flex items-center justify-center text-[#0d7ff2]">
                <span className="material-symbols-outlined text-[28px]">home_app_logo</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white">Roomy</span>
            </div>
            {/* Title */}
            <h1 className="text-2xl font-bold text-[#111418] dark:text-white">회원가입</h1>
            {/* Subtitle */}
            <h3 className="text-[#60758a] dark:text-[#9ca3af] text-sm md:text-base font-medium">
              3분만에 첫 가이드를 만들어보세요
            </h3>
          </div>

          {/* Signup Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Name Input (Optional) */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[#111418] dark:text-white text-sm font-semibold"
                htmlFor="name"
              >
                이름 (선택)
              </label>
              <input
                className="form-input flex w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-[#0d7ff2] focus:ring-[#0d7ff2] h-12 px-4 placeholder:text-[#9ca3af] text-base transition-colors"
                id="name"
                name="name"
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[#111418] dark:text-white text-sm font-semibold"
                htmlFor="email"
              >
                이메일
              </label>
              <input
                className="form-input flex w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-[#0d7ff2] focus:ring-[#0d7ff2] h-12 px-4 placeholder:text-[#9ca3af] text-base transition-colors"
                id="email"
                name="email"
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[#111418] dark:text-white text-sm font-semibold"
                htmlFor="password"
              >
                비밀번호
              </label>
              <div className="relative flex w-full">
                <input
                  className="form-input flex w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-[#0d7ff2] focus:ring-[#0d7ff2] h-12 pl-4 pr-12 placeholder:text-[#9ca3af] text-base transition-colors"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호 (8자 이상)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-[#9ca3af] hover:text-[#60758a] dark:hover:text-white transition-colors"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  disabled={isLoading}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[#111418] dark:text-white text-sm font-semibold"
                htmlFor="confirm_password"
              >
                비밀번호 확인
              </label>
              <input
                className="form-input flex w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-[#0d7ff2] focus:ring-[#0d7ff2] h-12 px-4 placeholder:text-[#9ca3af] text-base transition-colors"
                id="confirm_password"
                name="confirmPassword"
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mt-1">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="w-4 h-4 border border-[#dbe0e6] dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#0d7ff2]/20 checked:bg-[#0d7ff2] checked:border-[#0d7ff2] transition-colors"
                  disabled={isLoading}
                />
              </div>
              <label className="text-xs text-[#60758a] dark:text-[#9ca3af] leading-5" htmlFor="terms">
                <Link href="#" className="text-[#0d7ff2] hover:underline font-medium">
                  이용약관
                </Link>
                {" "}및{" "}
                <Link href="#" className="text-[#0d7ff2] hover:underline font-medium">
                  개인정보처리방침
                </Link>
                에 동의합니다
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-[#0d7ff2] hover:bg-blue-600 text-white font-bold h-12 rounded-lg transition-colors flex items-center justify-center shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "가입 중..." : "가입하기"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-[#e5e7eb] dark:bg-gray-700" />
            <span className="text-[#9ca3af] text-sm font-medium">또는</span>
            <div className="h-px flex-1 bg-[#e5e7eb] dark:bg-gray-700" />
          </div>

          {/* Social Signup Buttons */}
          <div className="flex flex-col gap-3">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white h-12 rounded-lg border border-[#e5e7eb] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-[#111418] font-medium text-[15px]">Google로 시작하기</span>
            </button>

            {/* Kakao Button */}
            <button
              type="button"
              onClick={handleKakaoSignup}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FDD835] h-12 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-[#3C1E1E]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C7.58 3 4 5.28 4 8.5C4 10.59 5.34 12.44 7.42 13.4L6.59 16.5C6.54 16.69 6.74 16.86 6.91 16.74L10.74 14.19C11.15 14.23 11.57 14.25 12 14.25C16.42 14.25 20 11.97 20 8.75C20 5.53 16.42 3 12 3Z" />
              </svg>
              <span className="text-[#3C1E1E] font-medium text-[15px]">카카오로 시작하기</span>
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <p className="text-[#60758a] dark:text-[#9ca3af] text-sm">이미 계정이 있으신가요?</p>
            <Link href="/login" className="text-[#0d7ff2] font-bold text-sm hover:underline">
              로그인
            </Link>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#60758a] opacity-70">© 2024 Roomy Inc.</p>
        </div>
      </div>
    </div>
  );
};
