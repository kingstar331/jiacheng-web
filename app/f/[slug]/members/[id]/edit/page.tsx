"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function EditMemberPage() {
  const params = useParams();
  const slug = params.slug as string;
  const id = params.id as string;
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadMember() {
      const supabase = createClient();
      const { data: member } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single();

      if (member) {
        setForm({
          name: member.name,
          gender: String(member.gender || 0),
          birth_year: member.birth_year?.toString() || "",
          death_year: member.death_year?.toString() || "",
          birthplace: member.birthplace || "",
          occupation: member.occupation || "",
          bio: member.bio || "",
          generation: member.generation?.toString() || "1",
        });
      }
    }
    loadMember();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase
      .from("members")
      .update({
        name: form.name,
        gender: parseInt(form.gender),
        birth_year: form.birth_year ? parseInt(form.birth_year) : null,
        death_year: form.death_year ? parseInt(form.death_year) : null,
        birthplace: form.birthplace || null,
        occupation: form.occupation || null,
        bio: form.bio || null,
        generation: parseInt(form.generation),
      })
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      router.push(`/f/${slug}/members/${id}`);
      router.refresh();
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("确定删除此成员吗？此操作不可恢复。")) return;
    setIsDeleting(true);

    const supabase = createClient();
    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) {
      setError(error.message);
      setIsDeleting(false);
    } else {
      router.push(`/f/${slug}`);
      router.refresh();
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <Link href={`/f/${slug}/members/${id}`} className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回档案
        </Link>

        <Card className="border-[#e8e0d4] bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-[#5c4a32]">编辑成员</CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              删除
            </Button>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">逝世年份</Label>
                  <Input
                    type="number"
                    value={form.death_year}
                    onChange={(e) => updateField("death_year", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
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
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">职业</Label>
                  <Input
                    value={form.occupation}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
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
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
                disabled={loading}
              >
                {loading ? "保存中..." : "保存修改"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
