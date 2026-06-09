"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Users, MapPin, BookOpen, Sparkles, Check, UserPlus } from "lucide-react";

type Step = "family" | "founder" | "preview" | "done";

// 金氏家族完整数据
const JIN_FAMILY_DATA = {
  name: "金氏家族",
  slug: "jin-family",
  origin: "湖北枣阳",
  description: "聚是一团火，散作满天星",
  members: [
    // 第一代
    { name: "金如香", gender: 1, birth_year: 1931, death_year: 2020, birthplace: "湖北枣阳", current_location: "湖北安陆棠棣镇", occupation: "林业局干部/抗美援朝老兵", bio: "出生于湖北枣阳，原姓周。幼年时逢战乱，成为孤儿，后被金姓人家收养。1950年参加抗美援朝，转业后到棠棣镇林业局工作。", generation: 1, order_in_siblings: 0, is_living: false },
    { name: "蒋忠英", gender: 2, birth_year: 1933, death_year: 2015, birthplace: "湖北安陆", current_location: "湖北安陆棠棣镇", occupation: "家庭主妇", bio: "金如香妻子，安陆本地人。", generation: 1, order_in_siblings: 1, is_living: false },
    // 第二代
    { name: "金道武", gender: 1, birth_year: 1957, birthplace: "湖北安陆棠棣镇", current_location: "湖北安陆", occupation: "个体户（粮食收购）", bio: "金如香长子。从事粮食收购生意。", generation: 2, order_in_siblings: 0, is_living: true },
    { name: "潘云芳", gender: 2, birth_year: 1958, birthplace: "湖北安陆", current_location: "湖北安陆", occupation: "家庭主妇", bio: "金道武妻子。", generation: 2, order_in_siblings: 1, is_living: true },
    { name: "金道富", gender: 1, birth_year: 1960, birthplace: "湖北安陆棠棣镇", current_location: "湖北安陆", occupation: "待补充", bio: "金如香次子。", generation: 2, order_in_siblings: 2, is_living: true },
    { name: "金道莲", gender: 2, birth_year: 1962, birthplace: "湖北安陆棠棣镇", current_location: "湖北安陆", occupation: "待补充", bio: "金如香女儿。", generation: 2, order_in_siblings: 3, is_living: true },
    { name: "金道贵", gender: 1, birth_year: 1965, birthplace: "湖北安陆棠棣镇", current_location: "湖北安陆", occupation: "待补充", bio: "金如香三子。", generation: 2, order_in_siblings: 4, is_living: true },
    // 第三代
    { name: "金亮", gender: 1, birth_year: 1981, birthplace: "湖北安陆棠棣镇", current_location: "四川成都", occupation: "待补充", bio: "金道武长子。现居成都，育有两女。", generation: 3, order_in_siblings: 0, is_living: true },
    { name: "周丽娟", gender: 2, birth_year: 1982, birthplace: "四川", current_location: "四川成都", occupation: "待补充", bio: "金亮妻子。", generation: 3, order_in_siblings: 1, is_living: true },
    { name: "金星", gender: 2, birth_year: 1983, birthplace: "湖北安陆棠棣镇", current_location: "广东深圳", occupation: "待补充", bio: "金道武女儿。现居深圳。", generation: 3, order_in_siblings: 2, is_living: true },
    { name: "谢明远", gender: 1, birth_year: 1980, birthplace: "待补充", current_location: "广东深圳", occupation: "待补充", bio: "金星丈夫。", generation: 3, order_in_siblings: 3, is_living: true },
    // 第四代
    { name: "金氏长女", gender: 2, birth_year: 2010, birthplace: "四川成都", current_location: "四川成都", occupation: "", bio: "金亮长女。", generation: 4, order_in_siblings: 0, is_living: true },
    { name: "金氏次女", gender: 2, birth_year: 2012, birthplace: "四川成都", current_location: "四川成都", occupation: "", bio: "金亮次女。", generation: 4, order_in_siblings: 1, is_living: true },
    { name: "谢忻然", gender: 2, birth_year: 2013, birthplace: "广东深圳", current_location: "广东深圳", occupation: "", bio: "金星长女。", generation: 4, order_in_siblings: 0, is_living: true },
    { name: "谢芮安", gender: 2, birth_year: 2015, birthplace: "广东深圳", current_location: "广东深圳", occupation: "", bio: "金星次女。", generation: 4, order_in_siblings: 1, is_living: true },
  ]
};

const FAMILY_TEMPLATES = [
  { name: "金氏家族", origin: "湖北枣阳", description: "聚是一团火，散作满天星" },
  { name: "李氏宗族", origin: "山东济南", description: "忠厚传家久，诗书继世长" },
  { name: "张氏大家庭", origin: "福建泉州", description: "海纳百川，有容乃大" },
  { name: "王氏世家", origin: "江苏南京", description: "明德惟馨，笃行致远" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("family");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 家族信息
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [origin, setOrigin] = useState("");
  const [description, setDescription] = useState("");

  // 创始人信息
  const [founderName, setFounderName] = useState("");
  const [founderGender, setFounderGender] = useState<number>(1);
  const [founderBirthYear, setFounderBirthYear] = useState("");
  const [founderBio, setFounderBio] = useState("");

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 30);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const applyTemplate = (template: typeof FAMILY_TEMPLATES[0]) => {
    setName(template.name);
    setSlug(generateSlug(template.name));
    setOrigin(template.origin);
    setDescription(template.description);
  };

  const handleCreateFamily = async () => {
    setLoading(true);
    setError("");

    const { data: { user } } = await createClient().auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data: family, error: familyError } = await createClient()
      .from("families")
      .insert({
        name,
        slug,
        origin,
        description,
        admin_id: user.id,
      })
      .select()
      .single();

    if (familyError) {
      if (familyError.code === "23505") {
        setError("家族链接已被占用，请修改");
      } else {
        setError(familyError.message);
      }
      setLoading(false);
      return;
    }

    // 如果有创始人信息，创建创始人
    if (founderName.trim()) {
      await createClient()
        .from("members")
        .insert({
          family_id: family.id,
          name: founderName,
          gender: founderGender,
          birth_year: founderBirthYear ? parseInt(founderBirthYear) : null,
          bio: founderBio,
          generation: 1,
          order_in_siblings: 0,
          created_by: user.id,
        });
    }

    setStep("done");
    setLoading(false);

    // 3秒后跳转到家族页面
    setTimeout(() => {
      router.push(`/f/${slug}`);
    }, 2000);
  };

  // 导入金氏家族
  const handleImportJinFamily = async () => {
    setLoading(true);
    setError("");

    const { data: { user } } = await createClient().auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // 1. 创建家族
    const { data: family, error: familyError } = await createClient()
      .from("families")
      .insert({
        name: JIN_FAMILY_DATA.name,
        slug: JIN_FAMILY_DATA.slug,
        origin: JIN_FAMILY_DATA.origin,
        description: JIN_FAMILY_DATA.description,
        admin_id: user.id,
      })
      .select()
      .single();

    if (familyError) {
      if (familyError.code === "23505") {
        setError("金氏家族已存在，请直接访问 /f/jin-family");
      } else {
        setError(familyError.message);
      }
      setLoading(false);
      return;
    }

    // 2. 批量创建成员
    const memberMap = new Map<string, string>(); // name -> id
    
    for (const memberData of JIN_FAMILY_DATA.members) {
      const { data: member, error: memberError } = await createClient()
        .from("members")
        .insert({
          family_id: family.id,
          name: memberData.name,
          gender: memberData.gender,
          birth_year: memberData.birth_year,
          death_year: (memberData as any).death_year || null,
          birthplace: memberData.birthplace,
          current_location: memberData.current_location,
          occupation: memberData.occupation,
          bio: memberData.bio,
          generation: memberData.generation,
          order_in_siblings: memberData.order_in_siblings,
          is_living: memberData.is_living,
          created_by: user.id,
        })
        .select()
        .single();

      if (!memberError && member) {
        memberMap.set(memberData.name, member.id);
      }
    }

    // 3. 更新配偶关系
    const spousePairs = [
      ["金如香", "蒋忠英"],
      ["金道武", "潘云芳"],
      ["金亮", "周丽娟"],
      ["金星", "谢明远"],
    ];

    for (const [name1, name2] of spousePairs) {
      const id1 = memberMap.get(name1);
      const id2 = memberMap.get(name2);
      if (id1 && id2) {
        await createClient()
          .from("members")
          .update({ spouse_id: id2 })
          .eq("id", id1);
        await createClient()
          .from("members")
          .update({ spouse_id: id1 })
          .eq("id", id2);
      }
    }

    // 4. 更新父子关系
    const parentChildPairs = [
      { parent: "金如香", children: ["金道武", "金道富", "金道莲", "金道贵"] },
      { parent: "金道武", children: ["金亮", "金星"] },
      { parent: "金亮", children: ["金氏长女", "金氏次女"] },
      { parent: "金星", children: ["谢忻然", "谢芮安"] },
    ];

    for (const { parent, children } of parentChildPairs) {
      const parentId = memberMap.get(parent);
      if (parentId) {
        for (const childName of children) {
          const childId = memberMap.get(childName);
          if (childId) {
            await createClient()
              .from("members")
              .update({ parent_id: parentId })
              .eq("id", childId);
          }
        }
      }
    }

    setStep("done");
    setLoading(false);

    setTimeout(() => {
      router.push(`/f/jin-family`);
    }, 2000);
  };

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "family", label: "家族信息", icon: <Users className="h-4 w-4" /> },
    { key: "founder", label: "创始人", icon: <UserPlus className="h-4 w-4" /> },
    { key: "preview", label: "预览", icon: <BookOpen className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8953f] to-[#b08435] text-white mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#5c4a32]">创建您的家族</h1>
          <p className="text-[#8a7a65] mt-1">只需几步，开启家族记忆之旅</p>
        </div>

        {/* 步骤指示器 */}
        {step !== "done" && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, index) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    step === s.key
                      ? "bg-[#c8953f] text-white"
                      : steps.findIndex((x) => x.key === step) > index
                      ? "bg-[#c8953f]/10 text-[#c8953f]"
                      : "bg-[#e8e0d4] text-[#8a7a65]"
                  }`}
                >
                  {steps.findIndex((x) => x.key === step) > index ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    s.icon
                  )}
                  {s.label}
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-[#e8e0d4]" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* 步骤内容 */}
        <Card className="border-[#e8e0d4] bg-white">
          <CardContent className="p-6">
            {step === "family" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-[#5c4a32]">填写家族信息</h2>
                  <p className="text-sm text-[#8a7a65] mt-1">选择模板或自定义创建</p>
                </div>

                {/* 模板选择 */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {FAMILY_TEMPLATES.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => applyTemplate(template)}
                      className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                        name === template.name
                          ? "border-[#c8953f] bg-[#c8953f]/5"
                          : "border-[#e8e0d4] hover:border-[#c8953f]/50"
                      }`}
                    >
                      <div className="font-medium text-[#5c4a32]">{template.name}</div>
                      <div className="flex items-center gap-1 text-xs text-[#8a7a65] mt-1">
                        <MapPin className="h-3 w-3" />
                        {template.origin}
                      </div>
                    </button>
                  ))}
                </div>

                {/* 快速导入 */}
                <div className="rounded-xl border-2 border-dashed border-[#c8953f]/40 bg-[#c8953f]/5 p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#c8953f]/20 flex items-center justify-center text-[#c8953f]">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-[#5c4a32]">一键导入金氏家族</div>
                        <div className="text-xs text-[#8a7a65]">
                          包含4代15人完整数据，含配偶关系
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleImportJinFamily}
                      disabled={loading}
                      className="bg-[#c8953f] hover:bg-[#b08435] text-white"
                    >
                      {loading ? "导入中..." : "立即导入"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#5c4a32]">
                    家族名称 *
                  </Label>
                  <Input
                    id="name"
                    placeholder="如：金氏家族"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-[#5c4a32]">
                    家族链接 *
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#8a7a65] whitespace-nowrap">
                      jiacheng.app/f/
                    </span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                      pattern="[a-z0-9-]+"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origin" className="text-[#5c4a32]">
                    祖籍
                  </Label>
                  <Input
                    id="origin"
                    placeholder="如：湖北枣阳"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#5c4a32]">
                    家族简介 / 家训
                  </Label>
                  <textarea
                    id="description"
                    placeholder="简述家族历史或家训..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border border-[#e8e0d4] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8953f] min-h-[80px] resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep("founder")}
                    disabled={!name.trim() || !slug.trim()}
                    className="bg-[#c8953f] hover:bg-[#b08435] text-white"
                  >
                    下一步
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {step === "founder" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-[#5c4a32]">添加家族创始人</h2>
                  <p className="text-sm text-[#8a7a65] mt-1">
                    记录家族的第一代人（可选，可稍后添加）
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="founderName" className="text-[#5c4a32]">
                    姓名
                  </Label>
                  <Input
                    id="founderName"
                    placeholder="如：金如香"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">性别</Label>
                  <div className="flex gap-3">
                    {[
                      { value: 1, label: "男" },
                      { value: 2, label: "女" },
                    ].map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setFounderGender(g.value)}
                        className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                          founderGender === g.value
                            ? "border-[#c8953f] bg-[#c8953f]/10 text-[#c8953f]"
                            : "border-[#e8e0d4] text-[#8a7a65] hover:border-[#c8953f]/50"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="founderBirthYear" className="text-[#5c4a32]">
                    出生年份
                  </Label>
                  <Input
                    id="founderBirthYear"
                    placeholder="如：1931"
                    value={founderBirthYear}
                    onChange={(e) => setFounderBirthYear(e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="founderBio" className="text-[#5c4a32]">
                    生平简介
                  </Label>
                  <textarea
                    id="founderBio"
                    placeholder="简述生平事迹..."
                    value={founderBio}
                    onChange={(e) => setFounderBio(e.target.value)}
                    className="w-full rounded-md border border-[#e8e0d4] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8953f] min-h-[100px] resize-none"
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep("family")}
                    className="border-[#e8e0d4]"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    上一步
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep("preview")}
                      className="border-[#e8e0d4]"
                    >
                      跳过
                    </Button>
                    <Button
                      onClick={() => setStep("preview")}
                      className="bg-[#c8953f] hover:bg-[#b08435] text-white"
                    >
                      下一步
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === "preview" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-[#5c4a32]">预览您的家族</h2>
                  <p className="text-sm text-[#8a7a65] mt-1">确认信息无误后创建</p>
                </div>

                {/* 预览卡片 */}
                <div className="rounded-xl border-2 border-[#c8953f]/30 bg-gradient-to-br from-[#faf8f3] to-white p-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#c8953f] to-[#b08435] text-white text-3xl font-bold mb-3">
                      {name.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-bold text-[#5c4a32]">{name}</h3>
                    {origin && (
                      <div className="flex items-center justify-center gap-1 text-sm text-[#8a7a65] mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {origin}
                      </div>
                    )}
                  </div>

                  {description && (
                    <div className="text-center mb-4">
                      <p className="text-[#5c4a32]/80 italic">"{description}"</p>
                    </div>
                  )}

                  <div className="border-t border-[#e8e0d4] pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8a7a65]">家族链接</span>
                      <span className="text-[#5c4a32] font-mono">
                        jiacheng.app/f/{slug}
                      </span>
                    </div>

                    {founderName && (
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-[#8a7a65]">创始人</span>
                        <span className="text-[#5c4a32]">
                          {founderName}
                          {founderBirthYear && ` (${founderBirthYear}年)`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep("founder")}
                    className="border-[#e8e0d4]"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    上一步
                  </Button>
                  <Button
                    onClick={handleCreateFamily}
                    disabled={loading}
                    className="bg-[#c8953f] hover:bg-[#b08435] text-white"
                  >
                    {loading ? (
                      <>创建中...</>
                    ) : (
                      <>
                        创建家族
                        <Sparkles className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === "done" && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
                  <Check className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-[#5c4a32] mb-2">
                  家族创建成功！
                </h2>
                <p className="text-[#8a7a65] mb-6">
                  正在跳转到您的家族页面...
                </p>
                <div className="animate-pulse text-[#c8953f]">
                  <Sparkles className="h-6 w-6 mx-auto" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 底部提示 */}
        {step !== "done" && (
          <p className="text-center text-xs text-[#8a7a65] mt-6">
            创建即表示您同意家承的服务条款和隐私政策
          </p>
        )}
      </div>
    </div>
  );
}
