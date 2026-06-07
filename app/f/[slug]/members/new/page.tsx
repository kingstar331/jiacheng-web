"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewMemberPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    gender: "0",
    birth_year: "",
    death_year: "",
    birthplace: "",
    occupation: "",
    bio: "",
    generation: "1",
    parent_id: "",
    spouse_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    // 先查 family_id
    const { data: family } = await supabase
      .from("families")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!family) {
      setError("家族不存在");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("members").insert({
      family_id: family.id,
      name: form.name,
      gender: parseInt(form.gender),
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      death_year: form.death_year ? parseInt(form.death_year) : null,
      birthplace: form.birthplace || null,
      occupation: form.occupation || null,
      bio: form.bio || null,
      generation: parseInt(form.generation),
      parent_id: form.parent_id || null,
      spouse_id: form.spouse_id || null,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push(`/f/${slug}`);
      router.refresh();
    }

    setLoading(false);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <Link href={`/f/${slug}`} className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回族谱
        </Link>

        <Card className="border-[#e8e0d4] bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-[#5c4a32]">添加家族成员</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">姓名 *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">性别</Label>
                  <select
                    value={form.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className="w-full rounded-md border border-[#e8e0d4] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8953f]"
                  >
                    <option value="0">未知</option>
                    <option value="1">男</option>
                    <option value="2">女</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">出生年份</Label>
                  <Input
                    type="number"
                    value={form.birth_year}
                    onChange={(e) => updateField("birth_year", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                    placeholder="如：1957"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">逝世年份（如在世留空）</Label>
                  <Input
                    type="number"
                    value={form.death_year}
                    onChange={(e) => updateField("death_year", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                    placeholder="如：2020"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">出生地</Label>
                  <Input
                    value={form.birthplace}
                    onChange={(e) => updateField("birthplace", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                    placeholder="如：湖北枣阳"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">职业</Label>
                  <Input
                    value={form.occupation}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                    placeholder="如：个体户"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#5c4a32]">代数</Label>
                <Input
                  type="number"
                  value={form.generation}
                  onChange={(e) => updateField("generation", e.target.value)}
                  className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#5c4a32]">生平简介</Label>
                <textarea
                  value={form.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  className="w-full rounded-md border border-[#e8e0d4] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8953f] min-h-[100px] resize-none"
                  placeholder="简述此人的生平故事..."
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
                disabled={loading}
              >
                {loading ? "保存中..." : "添加成员"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
