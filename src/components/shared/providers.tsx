"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner"; // Підключимо тут і тости, щоб вони були скрізь

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
};
