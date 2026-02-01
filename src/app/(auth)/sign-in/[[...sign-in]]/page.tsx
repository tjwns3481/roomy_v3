import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 - Roomy",
  description: "숙소 가이드를 3분만에 만들어보세요",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#f5f7f8] to-white dark:from-[#101922] dark:via-[#101922] dark:to-[#101922]">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white dark:bg-[#1a2632] shadow-2xl rounded-[24px]",
            headerTitle: "text-[#111418] dark:text-white",
            headerSubtitle: "text-[#60758a] dark:text-[#9ca3af]",
            socialButtonsBlockButton:
              "border-[#e5e7eb] hover:bg-gray-50 dark:border-gray-700",
            formFieldLabel: "text-[#111418] dark:text-white",
            formFieldInput:
              "border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white",
            formButtonPrimary:
              "bg-[#0d7ff2] hover:bg-blue-600 text-white font-bold",
            footerActionLink: "text-[#0d7ff2] hover:text-blue-600",
          },
        }}
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}
