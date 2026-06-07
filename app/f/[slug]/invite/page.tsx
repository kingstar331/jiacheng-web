"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";

export default function InvitePage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createClient();

  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const generateInvite = async () => {
    setLoading(true);

    const supabase = createClient();
    const { data: family } = await supabase
      .from("families")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!family) {
      alert("家族不存在");
      setLoading(false);
      return;
    }

    const code = Math.random().toString(36).substring(2, 10);
    const { error } = await supabase.from("invitations").insert({
      family_id: family.id,
      code,
      role,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    if (error) {
      alert(error.message);
    } else {
      const url = `${window.location.origin}/invite/${code}`;
      setInviteUrl(url);
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-xl">
        <Link
          href={`/f/${slug}`}
          className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回族谱
        </Link>

        <Card className="border-[#e8e0d4] bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-[#5c4a32]">邀请家族成员</CardTitle>
            <CardDescription className="text-[#8a7a65]">
              生成邀请链接，发送给亲属共同编辑族谱
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#5c4a32]">权限</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "editor" | "viewer")}
                className="w-full rounded-md border border-[#e8e0d4] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8953f]"
              >
                <option value="editor">编辑者（可添加/修改成员）</option>
                <option value="viewer">查看者（仅浏览）</option>
              </select>
            </div>

            <Button
              onClick={generateInvite}
              className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
              disabled={loading}
            >
              {loading ? "生成中..." : "生成邀请链接"}
            </Button>

            {inviteUrl && (
              <div className="mt-4 rounded-lg border border-[#e8e0d4] bg-[#faf8f3] p-4">
                <p className="mb-2 text-sm text-[#5c4a32]">邀请链接（7天内有效）：</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={inviteUrl}
                    className="flex-1 rounded-md border border-[#e8e0d4] bg-white px-3 py-2 text-sm text-[#5c4a32]"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="border-[#c8953f] text-[#c8953f]"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
