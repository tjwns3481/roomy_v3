'use client';

import { useState, useEffect } from 'react';
import { useSignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  // 로그인 상태 확인 중이거나 이미 로그인된 경우 로딩 표시
  if (!isLoaded || isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-slate-600 dark:text-slate-400 text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (strategy: 'oauth_google' | 'oauth_kakao') => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        strategy: strategy as any, // Clerk types don't include Kakao OAuth
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || '소셜 로그인에 실패했습니다.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Layer with Image and Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Architectural Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBxaTsBOo8A33JC5OL_uvC9UF5ckyIKNMe6NG7jofeXZbXuSso2Qo3sQYEF-CfdcmmrRsJCLf0NisPUlzwxPpSThBalUGLcmHcCLdZZNB88n_t01B_tLrwJLLkJUCYou3IRVQ6UyoMlTw7rEcC8BBubfUklNKEA_rthbScQqlPXV0lDvxXyOe9NAjQlrRi4CAemVruOyJ96sCG8jPOJ3ONYOVnDuvdo__1Hy7uDYQ8n0PWg5pUci1myThlI7N9_1iG2ayh7LLnMghs")`,
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
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">home_app_logo</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white">
                Roomy
              </span>
            </div>
            {/* Subtitle */}
            <h3 className="text-[#60758a] dark:text-[#9ca3af] text-sm md:text-base font-medium">
              숙소 가이드를 3분만에 만들어보세요
            </h3>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

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
                className="flex w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-primary h-12 px-4 placeholder:text-[#9ca3af] text-base transition-colors"
                id="email"
                name="email"
                placeholder="이메일"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  className="flex w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-primary h-12 pl-4 pr-12 placeholder:text-[#9ca3af] text-base transition-colors"
                  id="password"
                  name="password"
                  placeholder="비밀번호"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  aria-label="Toggle password visibility"
                  className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-[#9ca3af] hover:text-[#60758a] dark:hover:text-white transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                className="text-[#60758a] dark:text-[#9ca3af] text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors"
                href="/forgot-password"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              className="mt-2 w-full bg-primary hover:bg-blue-600 text-white font-bold h-12 rounded-lg transition-colors flex items-center justify-center shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                '로그인'
              )}
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
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white h-12 rounded-lg border border-[#e5e7eb] hover:bg-gray-50 transition-colors group"
              type="button"
              onClick={() => handleSocialLogin('oauth_google')}
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
              className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FDD835] h-12 rounded-lg transition-colors"
              type="button"
              onClick={() => handleSocialLogin('oauth_kakao')}
            >
              <svg
                className="w-5 h-5 text-[#3C1E1E]"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 3C7.58 3 4 5.28 4 8.5C4 10.59 5.34 12.44 7.42 13.4L6.59 16.5C6.54 16.69 6.74 16.86 6.91 16.74L10.74 14.19C11.15 14.23 11.57 14.25 12 14.25C16.42 14.25 20 11.97 20 8.75C20 5.53 16.42 3 12 3Z" />
              </svg>
              <span className="text-[#3C1E1E] font-medium text-[15px]">카카오로 계속하기</span>
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <p className="text-[#60758a] dark:text-[#9ca3af] text-sm">계정이 없으신가요?</p>
            <Link className="text-primary font-bold text-sm hover:underline" href="/sign-up">
              회원가입
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#60758a] opacity-70">© 2024 Roomy Inc.</p>
        </div>
      </div>
    </div>
  );
}
