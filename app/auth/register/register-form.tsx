"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-[#e8e0d4] bg-white text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-[#5c4a32]">注册成功</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#8a7a65]">请查收邮件，点击验证链接完成注册。</p>
            <Button
              className="mt-4 bg-[#c8953f] hover:bg-[#b08435] text-white"
              onClick={() => router.push("/auth/login")}
            >
              去登录
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-[#e8e0d4] bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#5c4a32]">注册家承</CardTitle>
          <CardDescription className="text-[#8a7a65]">
            创建账号，开始记录您的家族
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#5c4a32]">姓名</Label>
              <Input
                id="name"
                placeholder="您的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#5c4a32]">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#5c4a32]">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少6位"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                minLength={6}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
              disabled={loading}
            >
              {loading ? "注册中..." : "注册"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[#8a7a65]">
            已有账号？{" "}
            <Link href="/auth/login" className="text-[#c8953f] hover:underline">
              立即登录
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
