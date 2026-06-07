"use client";

import { Suspense } from "react";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">加载中...</div>}>
      <LoginForm />
    </Suspense>
  );
}
