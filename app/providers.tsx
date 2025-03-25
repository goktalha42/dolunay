"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// Tip tanımlamasını ekleyelim
type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
} 