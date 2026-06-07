"use client";

import { Suspense } from "react";
import RegisterForm from "./register-form";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">加载中...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
