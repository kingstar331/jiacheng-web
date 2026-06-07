"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === "Invalid login credentials" ? "邮箱或密码错误" : error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }

    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("请输入邮箱");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
    } else {
      setError("");
      alert("魔法链接已发送，请查收邮件");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-[#e8e0d4] bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#5c4a32]">登录家承</CardTitle>
          <CardDescription className="text-[#8a7a65]">
            登录后即可创建或管理您的家族
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
              disabled={loading}
            >
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            <Button
              variant="outline"
              className="w-full border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10"
              onClick={handleMagicLink}
              disabled={loading}
            >
              发送免密登录链接
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-[#8a7a65]">
            还没有账号？{" "}
            <Link href="/auth/register" className="text-[#c8953f] hover:underline">
              立即注册
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
