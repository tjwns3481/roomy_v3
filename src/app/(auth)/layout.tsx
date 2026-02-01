// @TASK P1-S1-T1 - 인증 레이아웃
// @SPEC specs/screens/auth/login.yaml

import * as React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
