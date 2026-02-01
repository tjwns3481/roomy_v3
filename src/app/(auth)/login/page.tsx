// @TASK P1-S1-T1 - 로그인 페이지
// @SPEC specs/screens/auth/login.yaml
// @DESIGN design/04-login.html

import * as React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 - Roomy",
  description: "숙소 가이드를 3분만에 만들어보세요",
};

export default function LoginPage() {
  return <LoginForm />;
}
