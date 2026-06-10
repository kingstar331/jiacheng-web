"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Home, LogIn } from "lucide-react";
import Link from "next/link";

interface Member {
  id: string;
  name: string;
  birth_year?: number;
}

export default function FamilyLoginPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [step, setStep] = useState<"code" | "name" | "verify">("code");
  const [familyCode, setFamilyCode] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [birthYear, setBirthYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 步骤1：验证家族码
  async function verifyFamilyCode() {
    setLoading(true);
    setError("");

    const supabase = createClient();

    // 查询家族
    const { data: family } = await supabase
      .from("families")
      .select("id, name, slug")
      .eq("slug", slug)
      .single();

    if (!family) {
      setError("家族不存在");
      setLoading(false);
      return;
    }

    // 验证家族码（简单规则：家族名拼音首字母+创建年份）
    // 实际应该用数据库存储的邀请码，这里简化处理
    const { data: invitation } = await supabase
      .from("invitations")
      .select("*")
      .eq("family_id", family.id)
      .eq("code", familyCode)
      .is("used_by", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (!invitation) {
      // 如果没有精确匹配，也接受家族slug作为简易码（方便测试）
      if (familyCode.toLowerCase() !== slug.toLowerCase()) {
        setError("家族码不正确");
        setLoading(false);
        return;
      }
    }

    // 获取家族成员列表
    const { data: membersData } = await supabase
      .from("members")
      .select("id, name, birth_year")
      .eq("family_id", family.id)
      .order("generation", { ascending: true });

    if (membersData && membersData.length > 0) {
      setMembers(membersData);
      setStep("name");
    } else {
      setError("家族暂无成员");
    }

    setLoading(false);
  }

  // 步骤2：选择名字
  function selectMember(member: Member) {
    setSelectedMember(member);
    setStep("verify");
  }

  // 步骤3：验证出生年份
  async function verifyBirthYear() {
    if (!selectedMember) return;

    setLoading(true);
    setError("");

    // 验证出生年份
    if (selectedMember.birth_year && parseInt(birthYear) !== selectedMember.birth_year) {
      setError("出生年份不正确，请重试");
      setLoading(false);
      return;
    }

    // 创建临时会话（使用 localStorage）
    const sessionData = {
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      familySlug: slug,
      loginAt: new Date().toISOString(),
      // 30天有效期
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    localStorage.setItem("jiacheng_family_session", JSON.stringify(sessionData));

    // 跳转到家族页面
    router.push(`/f/${slug}`);
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href={`/f/${slug}`}
          className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回
        </Link>

        <Card className="border-[#e8e0d4] bg-white">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#c8953f]/10 flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-[#c8953f]" />
            </div>
            <CardTitle className="text-2xl text-[#5c4a32]">
              家属登录
            </CardTitle>
            <p className="text-sm text-[#8a7a65]">
              无需邮箱密码，简单三步即可查看家族
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 步骤指示器 */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "code" ? "bg-[#c8953f] text-white" : "bg-[#c8953f] text-white"
              }`}>
                1
              </div>
              <div className="w-8 h-px bg-[#e8e0d4]" />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "name" || step === "verify" ? "bg-[#c8953f] text-white" : "bg-[#e8e0d4] text-[#8a7a65]"
              }`}>
                2
              </div>
              <div className="w-8 h-px bg-[#e8e0d4]" />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "verify" ? "bg-[#c8953f] text-white" : "bg-[#e8e0d4] text-[#8a7a65]"
              }`}>
                3
              </div>
            </div>

            {/* 步骤1：输入家族码 */}
            {step === "code" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#5c4a32] mb-1 block">
                    家族码
                  </label>
                  <Input
                    value={familyCode}
                    onChange={(e) => setFamilyCode(e.target.value)}
                    placeholder="请输入家族码（如：jin2024）"
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                  />
                  <p className="text-xs text-[#8a7a65] mt-1">
                    家族码可向家族管理员索取
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <Button
                  onClick={verifyFamilyCode}
                  disabled={!familyCode || loading}
                  className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
                >
                  {loading ? "验证中..." : "下一步"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm text-[#c8953f] hover:underline"
                  >
                    管理员邮箱登录 →
                  </Link>
                </div>
              </div>
            )}

            {/* 步骤2：选择自己的名字 */}
            {step === "name" && (
              <div className="space-y-4">
                <p className="text-sm text-[#5c4a32] font-medium">
                  请选择您的名字：
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => selectMember(member)}
                      className="p-3 rounded-lg border border-[#e8e0d4] hover:border-[#c8953f] hover:bg-[#faf8f3] transition-all text-left"
                    >
                      <span className="text-[#5c4a32] font-medium">
                        {member.name}
                      </span>
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setStep("code")}
                  className="w-full border-[#e8e0d4]"
                >
                  上一步
                </Button>
              </div>
            )}

            {/* 步骤3：验证出生年份 */}
            {step === "verify" && selectedMember && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg text-[#5c4a32] font-medium">
                    您好，{selectedMember.name}
                  </p>
                  <p className="text-sm text-[#8a7a65] mt-1">
                    请输入您的出生年份以验证身份
                  </p>
                </div>

                <Input
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="如：1957"
                  maxLength={4}
                  className="border-[#e8e0d4] focus-visible:ring-[#c8953f] text-center text-lg"
                />

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <Button
                  onClick={verifyBirthYear}
                  disabled={birthYear.length !== 4 || loading}
                  className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
                >
                  <LogIn className="mr-1 h-4 w-4" />
                  {loading ? "验证中..." : "登录"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setStep("name")}
                  className="w-full border-[#e8e0d4]"
                >
                  选错了，重新选择
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 说明 */}
        <div className="mt-6 p-4 rounded-lg bg-white border border-[#e8e0d4]">
          <p className="text-sm text-[#8a7a65]">
            💡 <span className="text-[#5c4a32] font-medium">提示：</span>
            家属登录无需注册邮箱，使用家族码+姓名+出生年份即可查看家族信息。
            登录状态保持30天。
          </p>
        </div>
      </div>
    </div>
  );
}
