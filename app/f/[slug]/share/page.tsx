"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Share2, Copy, Check, Link2, MessageCircle } from "lucide-react";

export default function SharePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // 生成分享链接
  async function generateShareLink() {
    setLoading(true);

    const supabase = createClient();

    // 查询家族
    const { data: family } = await supabase
      .from("families")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!family) {
      setLoading(false);
      return;
    }

    // 生成随机Token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // 存储到数据库（有效期30天）
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await supabase.from("family_share_links").insert({
      family_id: family.id,
      token: token,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    });

    // 生成完整链接
    const url = `${window.location.origin}/join-family/${token}`;
    setShareUrl(url);
    setLoading(false);
  }

  // 复制链接
  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // 复制微信分享文案
  async function copyWechatText() {
    const text = `【家承 - 家族记忆库】\n\n点击链接查看我们的家族族谱：\n${shareUrl}\n\n无需注册，点击即可查看。有效期30天。`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-lg">
        <Link href={`/f/${slug}`} className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回家族
        </Link>

        <Card className="border-[#e8e0d4] bg-white">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#c8953f]/10 flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-8 w-8 text-[#c8953f]" />
            </div>
            <CardTitle className="text-2xl text-[#5c4a32]">分享给家人</CardTitle>
            <p className="text-sm text-[#8a7a65]">
              生成专属链接，家人无需注册即可查看
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {!shareUrl ? (
              <Button
                onClick={generateShareLink}
                disabled={loading}
                className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white h-12 text-lg"
              >
                <Link2 className="mr-2 h-5 w-5" />
                {loading ? "生成中..." : "生成分享链接"}
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#5c4a32] mb-1 block">分享链接</label>
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="border-[#e8e0d4] bg-[#faf8f3]"
                    />
                    <Button
                      onClick={copyLink}
                      variant="outline"
                      className="border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-[#8a7a65] mt-1">
                    链接有效期30天，过期后需重新生成
                  </p>
                </div>

                <Button
                  onClick={copyWechatText}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  复制微信分享文案
                </Button>

                <Button
                  onClick={() => setShareUrl("")}
                  variant="outline"
                  className="w-full border-[#e8e0d4]"
                >
                  重新生成
                </Button>
              </div>
            )}

            <div className="p-4 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
              <h3 className="text-sm font-medium text-[#5c4a32] mb-2">使用说明</h3>
              <ol className="text-sm text-[#8a7a65] space-y-1 list-decimal list-inside">
                <li>点击"生成分享链接"</li>
                <li>复制链接或微信文案</li>
                <li>发送给家族成员（微信/短信）</li>
                <li>家人点击链接即可查看族谱</li>
                <li>无需注册邮箱密码</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
