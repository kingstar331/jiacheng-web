"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Home, AlertCircle } from "lucide-react";

export default function JoinFamilyPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [familyName, setFamilyName] = useState("");

  useEffect(() => {
    verifyToken();
  }, [token]);

  async function verifyToken() {
    const supabase = createClient();

    // 查询分享链接
    const { data: shareLink } = await supabase
      .from("family_share_links")
      .select("*, families(name, slug)")
      .eq("token", token)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (!shareLink) {
      setError("链接已过期或无效");
      setLoading(false);
      return;
    }

    setFamilyName(shareLink.families?.name || "");

    // 创建家属会话
    const sessionData = {
      familySlug: shareLink.families?.slug,
      shareToken: token,
      loginAt: new Date().toISOString(),
      expiresAt: shareLink.expires_at,
    };

    localStorage.setItem("jiacheng_family_session", JSON.stringify(sessionData));

    // 自动跳转到家族页面
    setTimeout(() => {
      router.push(`/f/${shareLink.families?.slug}`);
    }, 1500);

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#c8953f] animate-spin mx-auto mb-4" />
          <p className="text-[#5c4a32]">正在进入家族...{familyName && `「${familyName}」`}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
        <Card className="border-[#e8e0d4] bg-white max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-[#5c4a32]">无法访问</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-[#8a7a65]">{error}</p>
            <p className="text-sm text-[#8a7a65]">
              请联系家族管理员重新生成分享链接
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
      <Card className="border-[#e8e0d4] bg-white max-w-md w-full">
        <CardHeader className="text-center">
          <Home className="h-12 w-12 text-[#c8953f] mx-auto mb-4" />
          <CardTitle className="text-xl text-[#5c4a32]">欢迎加入「{familyName}」</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-[#8a7a65]">登录成功，正在跳转...{familyName && `「${familyName}」`}</p>
        </CardContent>
      </Card>
    </div>
  );
}
