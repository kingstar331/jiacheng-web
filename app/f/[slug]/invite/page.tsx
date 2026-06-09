"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Copy, Link2, Users, Check, RefreshCw } from "lucide-react";

export default function InvitePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [inviteCode, setInviteCode] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [familyName, setFamilyName] = useState("");

  useEffect(() => {
    loadFamilyAndCollaborators();
  }, [slug]);

  async function loadFamilyAndCollaborators() {
    const supabase = createClient();
    
    // 获取家族信息
    const { data: family } = await supabase
      .from("families")
      .select("*")
      .eq("slug", slug)
      .single();
    
    if (family) {
      setFamilyName(family.name);
      
      // 如果有邀请码，显示
      if (family.invite_code) {
        setInviteCode(family.invite_code);
        setInviteLink(`${window.location.origin}/join/${family.invite_code}`);
      }
      
      // 获取协作者列表
      const { data: collabs } = await supabase
        .from("family_collaborators")
        .select("*, profiles:user_id(full_name, email)")
        .eq("family_id", family.id);
      
      if (collabs) {
        setCollaborators(collabs);
      }
    }
  }

  function generateCode() {
    // 生成6位随机码（大写字母+数字）
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async function createInviteCode() {
    setLoading(true);
    const supabase = createClient();
    
    // 获取家族ID
    const { data: family } = await supabase
      .from("families")
      .select("id")
      .eq("slug", slug)
      .single();
    
    if (!family) {
      setLoading(false);
      return;
    }
    
    const code = generateCode();
    
    // 更新家族邀请码
    const { error } = await supabase
      .from("families")
      .update({ invite_code: code })
      .eq("id", family.id);
    
    if (!error) {
      setInviteCode(code);
      setInviteLink(`${window.location.origin}/join/${code}`);
    }
    
    setLoading(false);
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级方案
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/f/${slug}`}
          className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回{familyName || "家族"}
        </Link>

        <h1 className="text-2xl font-bold text-[#5c4a32] mb-2">邀请成员</h1>
        <p className="text-[#8a7a65] mb-8">
          生成邀请链接，邀请家族成员共同编辑族谱
        </p>

        {/* 邀请链接卡片 */}
        <Card className="border-[#e8e0d4] bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
              <Link2 className="h-5 w-5 text-[#c8953f]" />
              邀请链接
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!inviteCode ? (
              <div className="text-center py-6">
                <p className="text-sm text-[#8a7a65] mb-4">
                  还没有邀请链接，点击下方按钮生成
                </p>
                <Button
                  onClick={createInviteCode}
                  disabled={loading}
                  className="bg-[#c8953f] hover:bg-[#b08435] text-white"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "生成中..." : "生成邀请链接"}
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-lg bg-[#faf8f3] border border-[#e8e0d4] px-4 py-3">
                      <span className="text-sm font-mono text-[#5c4a32]">{inviteLink}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(inviteLink)}
                      className="border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          复制
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-[#faf8f3] border border-[#e8e0d4] px-4 py-3">
                    <div>
                      <p className="text-xs text-[#8a7a65] mb-1">邀请码</p>
                      <span className="text-lg font-mono font-bold text-[#c8953f] tracking-wider">
                        {inviteCode}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(inviteCode)}
                      className="text-[#8a7a65] hover:text-[#c8953f]"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e8e0d4]">
                  <p className="text-sm text-[#8a7a65] mb-3">分享给家人的方式：</p>
                  <ul className="space-y-2 text-sm text-[#5c4a32]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#c8953f] mt-0.5">1.</span>
                      复制上方链接，通过微信/短信发送给家人
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#c8953f] mt-0.5">2.</span>
                      家人打开链接，注册/登录后即可加入家族
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#c8953f] mt-0.5">3.</span>
                      加入后可以直接编辑族谱、添加故事
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#e8e0d4]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={createInviteCode}
                    disabled={loading}
                    className="text-[#8a7a65] border-[#e8e0d4]"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    重新生成邀请码
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 协作者列表 */}
        <Card className="border-[#e8e0d4] bg-white">
          <CardHeader>
            <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
              <Users className="h-5 w-5 text-[#c8953f]" />
              家族成员 ({collaborators.length + 1})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* 创建者 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#c8953f]/5 border border-[#c8953f]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f]">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#5c4a32]">创建者</p>
                    <p className="text-xs text-[#8a7a65]">拥有所有权限</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#c8953f]/10 text-[#c8953f] font-medium">
                  Admin
                </span>
              </div>

              {/* 协作者 */}
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#e8e0d4]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#faf8f3] flex items-center justify-center text-[#8a7a65]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[#5c4a32]">
                        {collab.profiles?.full_name || "未命名用户"}
                      </p>
                      <p className="text-xs text-[#8a7a65]">
                        {collab.profiles?.email || ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#e8e0d4]/50 text-[#8a7a65]">
                    {collab.role === "editor" ? "编辑者" : "查看者"}
                  </span>
                </div>
              ))}

              {collaborators.length === 0 && (
                <p className="text-sm text-[#8a7a65] text-center py-4">
                  还没有协作者，邀请家人加入吧
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
