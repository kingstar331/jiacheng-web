"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Link2, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BetaInvitePage() {
  const [copied, setCopied] = useState(false);
  
  // 内测专用链接
  const betaLinks = [
    {
      label: "金氏家族（直接查看）",
      url: "https://jiacheng-web.vercel.app/f/jin-family",
      desc: "无需注册，可直接浏览完整族谱",
    },
    {
      label: "创建自己的家族",
      url: "https://jiacheng-web.vercel.app/onboarding",
      desc: "注册后可创建新家族或导入示例数据",
    },
    {
      label: "内测指南",
      url: "https://jiacheng-web.vercel.app/beta",
      desc: "查看测试重点和反馈方式",
    },
  ];

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
          href="/beta"
          className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回内测指南
        </Link>

        <h1 className="text-2xl font-bold text-[#5c4a32] mb-2">邀请家人参与内测</h1>
        <p className="text-[#8a7a65] mb-8">
          复制下方链接，通过微信发送给家人
        </p>

        <div className="space-y-4">
          {betaLinks.map((link, index) => (
            <Card key={index} className="border-[#e8e0d4] bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-[#5c4a32] flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-[#c8953f]" />
                  {link.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-[#8a7a65]">{link.desc}</p>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg bg-[#faf8f3] border border-[#e8e0d4] px-3 py-2.5">
                    <span className="text-sm text-[#5c4a32] break-all">{link.url}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(link.url)}
                    className="border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10 flex-shrink-0"
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 微信分享提示 */}
        <Card className="border-[#c8953f] bg-[#c8953f]/5 mt-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Share2 className="h-5 w-5 text-[#c8953f] mt-0.5" />
              <div>
                <h3 className="font-medium text-[#5c4a32] mb-2">微信分享建议</h3>
                <div className="space-y-2 text-sm text-[#5c4a32]">
                  <p>1. 复制上方"金氏家族"链接</p>
                  <p>2. 打开微信，粘贴到家族群</p>
                  <p>3. 附上一段介绍文字，例如：</p>
                  <div className="rounded-lg bg-white border border-[#e8e0d4] p-3 text-sm text-[#5c4a32]">
                    "各位家人，我建了一个咱们金氏家族的在线族谱，大家可以看看，帮忙补充完善一下信息。点击链接即可查看，注册后还可以编辑。"
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 后续步骤 */}
        <Card className="border-[#e8e0d4] bg-white mt-6">
          <CardHeader>
            <CardTitle className="text-base text-[#5c4a32]">家人加入后的操作</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-[#5c4a32] list-decimal list-inside">
              <li>家人点击链接查看族谱</li>
              <li>点击"注册"创建账号</li>
              <li>您在家族页点击"邀请"生成邀请码</li>
              <li>家人使用邀请码加入家族</li>
              <li>家人可以编辑信息、添加故事</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
