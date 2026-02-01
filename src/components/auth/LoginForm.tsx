// @TASK P1-S1-T1 - 로그인 폼 컴포넌트
// @TASK P1-S1-T2 - useAuth 훅 연결
// @SPEC specs/screens/auth/login.yaml
// @DESIGN design/04-login.html

"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<void>;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 클라이언트 유효성 검사
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      setIsLoading(true);
      if (onSubmit) {
        await onSubmit(email, password);
      } else {
        // TODO: useAuth 훅 연결
        console.log("로그인:", email);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google 로그인 시도");
  };

  const handleKakaoLogin = () => {
    console.log("Kakao 로그인 시도");
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
            {/* Subtitle */}
            <h3 className="text-[#60758a] dark:text-[#9ca3af] text-sm md:text-base font-medium">
              숙소 가이드를 3분만에 만들어보세요
            </h3>
          </div>

          {/* Login Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
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

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="#"
                className="text-[#60758a] dark:text-[#9ca3af] text-sm font-medium hover:text-[#0d7ff2] dark:hover:text-[#0d7ff2] transition-colors"
              >
                비밀번호를 잊으셨나요?
              </Link>
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
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-[#e5e7eb] dark:bg-gray-700" />
            <span className="text-[#9ca3af] text-sm font-medium">또는</span>
            <div className="h-px flex-1 bg-[#e5e7eb] dark:bg-gray-700" />
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col gap-3">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
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
              <span className="text-[#111418] font-medium text-[15px]">Google로 계속하기</span>
            </button>

            {/* Kakao Button */}
            <button
              type="button"
              onClick={handleKakaoLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FDD835] h-12 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-[#3C1E1E]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C7.58 3 4 5.28 4 8.5C4 10.59 5.34 12.44 7.42 13.4L6.59 16.5C6.54 16.69 6.74 16.86 6.91 16.74L10.74 14.19C11.15 14.23 11.57 14.25 12 14.25C16.42 14.25 20 11.97 20 8.75C20 5.53 16.42 3 12 3Z" />
              </svg>
              <span className="text-[#3C1E1E] font-medium text-[15px]">카카오로 계속하기</span>
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <p className="text-[#60758a] dark:text-[#9ca3af] text-sm">계정이 없으신가요?</p>
            <Link href="/signup" className="text-[#0d7ff2] font-bold text-sm hover:underline">
              회원가입
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
