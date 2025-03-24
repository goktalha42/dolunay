"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ClientPathCheckProps {
  children: (isAdminPage: boolean) => ReactNode;
}

export default function ClientPathCheck({ children }: ClientPathCheckProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin") || false;
  
  return <>{children(isAdminPage)}</>;
} 