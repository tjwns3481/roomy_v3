import { ReactNode } from "react";

interface HostLayoutProps {
  children: ReactNode;
}

export default function HostLayout({ children }: HostLayoutProps) {
  return <>{children}</>;
}
