'use client';

import { useState, useEffect } from 'react';
import { useSignUp, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

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

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreedToTerms) {
      setError('이용약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || '인증에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (strategy: 'oauth_google' | 'oauth_kakao') => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || '소셜 로그인에 실패했습니다.');
    }
  };

  if (pendingVerification) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-[440px] bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 sm:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[32px]">mail</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              이메일 인증
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {email}로 전송된 인증 코드를 입력해주세요
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleVerification} className="flex flex-col gap-4">
            <input
              className="w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center text-2xl tracking-[0.5em] font-mono"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />
              ) : (
                '인증하기'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-[440px] bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 p-8 sm:p-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px]">cottage</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Roomy
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            무료로 시작하기
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">
            3분만에 첫 가이드를 만들어보세요
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="sr-only" htmlFor="email">
              이메일
            </label>
            <input
              className="w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              id="email"
              name="email"
              placeholder="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1 relative group">
            <label className="sr-only" htmlFor="password">
              비밀번호
            </label>
            <div className="relative">
              <input
                className="w-full h-12 px-4 pr-12 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                id="password"
                name="password"
                placeholder="비밀번호 (8자 이상)"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="sr-only" htmlFor="confirm_password">
              비밀번호 확인
            </label>
            <input
              className="w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              id="confirm_password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 mt-1 mb-2">
            <div className="flex items-center h-5">
              <input
                className="w-4 h-4 border border-slate-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary/20 dark:bg-slate-700 dark:border-slate-600 accent-primary"
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
            </div>
            <label
              className="text-xs text-slate-500 dark:text-slate-400 leading-5"
              htmlFor="terms"
            >
              <Link className="text-primary hover:underline font-medium" href="/terms">
                이용약관
              </Link>{' '}
              및{' '}
              <Link className="text-primary hover:underline font-medium" href="/privacy">
                개인정보처리방침
              </Link>
              에 동의합니다
            </label>
          </div>

          {/* Submit Button */}
          <button
            className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              '가입하기'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-6 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
          <span className="flex-shrink-0 mx-4 text-xs text-slate-400 font-medium">또는</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
        </div>

        {/* Social Sign Up */}
        <div className="flex flex-col gap-3">
          {/* Google Button */}
          <button
            className="w-full h-12 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200 group"
            type="button"
            onClick={() => handleSocialSignUp('oauth_google')}
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
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
              Google로 시작하기
            </span>
          </button>

          {/* Kakao Button */}
          <button
            className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] rounded-lg flex items-center justify-center gap-3 transition-colors duration-200"
            type="button"
            onClick={() => handleSocialSignUp('oauth_kakao')}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M12 3C6.477 3 2 6.358 2 10.5C2 13.208 3.737 15.586 6.368 16.885L5.344 20.697C5.234 21.107 5.686 21.43 5.996 21.157L10.667 17.584C11.104 17.625 11.548 17.647 12 17.647C17.523 17.647 22 14.289 22 10.147C22 6.005 17.523 3 12 3Z"
                fill="#391B1B"
                fillRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-[#391B1B]/85">카카오로 시작하기</span>
          </button>
        </div>

        {/* Login Link Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            이미 계정이 있으신가요?
            <Link className="text-primary font-semibold hover:underline ml-1" href="/sign-in">
              로그인
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-8 text-slate-400 text-xs text-center">
        © 2024 Roomy Inc. All rights reserved.
      </div>
    </div>
  );
}
