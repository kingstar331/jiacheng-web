"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { TreePine, Users, ArrowRight, Check, Loader2 } from "lucide-react";

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [family, setFamily] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    loadFamily();
  }, [code]);

  async function loadFamily() {
    const supabase = createClient();
    
    // 通过邀请码查找家族
    const { data: familyData } = await supabase
      .from("families")
      .select("*")
      .eq("invite_code", code)
      .single();
    
    if (familyData) {
      setFamily(familyData);
      
      // 检查当前用户是否已加入
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: collab } = await supabase
          .from("family_collaborators")
          .select("*")
          .eq("family_id", familyData.id)
          .eq("user_id", user.id)
          .single();
        
        if (collab || familyData.admin_id === user.id) {
          setJoined(true);
        }
      }
    }
    
    setLoading(false);
  }

  async function joinFamily() {
    setJoining(true);
    setError("");
    
    const supabase = createClient();
    
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // 未登录，跳转到登录页
      router.push(`/login?redirect=/join/${code}`);
      return;
    }
    
    // 添加为协作者
    const { error: joinError } = await supabase
      .from("family_collaborators")
      .insert({
        family_id: family.id,
        user_id: user.id,
        role: "editor",
      });
    
    if (joinError) {
      if (joinError.message.includes("duplicate")) {
        setJoined(true);
      } else {
        setError("加入失败，请重试");
      }
    } else {
      setJoined(true);
    }
    
    setJoining(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c8953f]" />
      </div>
    );
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
        <div className="mx-auto max-w-md text-center pt-20">
          <TreePine className="h-16 w-16 text-[#e8e0d4] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#5c4a32] mb-2">
            邀请码无效
          </h1>
          <p className="text-[#8a7a65] mb-6">
            该邀请码不存在或已过期
          </p>
          <Link href="/">
            <Button className="bg-[#c8953f] hover:bg-[#b08435] text-white">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-md pt-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <TreePine className="h-8 w-8 text-[#c8953f]" />
            <span className="text-2xl font-bold text-[#5c4a32]">家承</span>
          </Link>
        </div>

        <Card className="border-[#e8e0d4] bg-white">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 rounded-full bg-[#c8953f]/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-[#c8953f]" />
            </div>
            <CardTitle className="text-xl text-[#5c4a32]">
              邀请你加入家族
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 家族信息 */}
            <div className="text-center p-4 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
              <h2 className="text-2xl font-bold text-[#5c4a32] mb-1">
                {family.name}
              </h2>
              {family.origin && (
                <p className="text-sm text-[#8a7a65]">
                  祖籍：{family.origin}
                </p>
              )}
              {family.description && (
                <p className="text-sm text-[#5c4a32]/80 mt-2">
                  {family.description}
                </p>
              )}
            </div>

            {joined ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">你已是该家族成员</span>
                </div>
                <Link href={`/f/${family.slug}`}>
                  <Button className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white">
                    进入家族
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[#8a7a65] text-center">
                  加入后，你可以：
                </p>
                <ul className="space-y-2 text-sm text-[#5c4a32]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#c8953f]" />
                    查看和编辑家族族谱
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#c8953f]" />
                    为家族成员添加故事和回忆
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#c8953f]" />
                    邀请其他家族成员
                  </li>
                </ul>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <Button
                  onClick={joinFamily}
                  disabled={joining}
                  className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
                >
                  {joining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      加入中...
                    </>
                  ) : (
                    "加入家族"
                  )}
                </Button>

                <p className="text-xs text-[#8a7a65] text-center">
                  需要先登录或注册账号
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
