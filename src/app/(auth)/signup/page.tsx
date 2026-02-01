// @TASK P7-PowerQA - 회원가입 페이지
// @DESIGN design/08-signup.html

import * as React from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 - Roomy",
  description: "3분만에 첫 가이드를 만들어보세요",
};

export default function SignupPage() {
  return <SignupForm />;
}
