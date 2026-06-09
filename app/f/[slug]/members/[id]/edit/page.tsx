"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, BookOpen, X } from "lucide-react";

interface Story {
  title: string;
  year: number | null;
  content: string;
}

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
    birth_date: "",
    death_date: "",
    birthplace: "",
    current_location: "",
    occupation: "",
    education: "",
    bio: "",
    stories: "",
    generation: "1",
    is_living: "true",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);

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
          birth_date: member.birth_date || "",
          death_date: member.death_date || "",
          birthplace: member.birthplace || "",
          current_location: member.current_location || "",
          occupation: member.occupation || "",
          education: member.education || "",
          bio: member.bio || "",
          stories: "",
          generation: member.generation?.toString() || "1",
          is_living: String(member.is_living),
        });
        
        // 解析 stories JSON
        if (member.stories) {
          try {
            const parsed = JSON.parse(member.stories);
            if (Array.isArray(parsed)) {
              setStories(parsed);
            }
          } catch {
            setStories([]);
          }
        }
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
        birth_date: form.birth_date || null,
        death_date: form.death_date || null,
        birthplace: form.birthplace || null,
        current_location: form.current_location || null,
        occupation: form.occupation || null,
        education: form.education || null,
        bio: form.bio || null,
        stories: stories.length > 0 ? JSON.stringify(stories) : null,
        generation: parseInt(form.generation),
        is_living: form.is_living === "true",
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
                  <Label className="text-[#5c4a32]">出生日期（完整）</Label>
                  <Input
                    type="date"
                    value={form.birth_date}
                    onChange={(e) => updateField("birth_date", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">逝世日期（完整）</Label>
                  <Input
                    type="date"
                    value={form.death_date}
                    onChange={(e) => updateField("death_date", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#5c4a32]">生存状态</Label>
                <div className="flex gap-3">
                  {[
                    { value: "true", label: "在世" },
                    { value: "false", label: "已逝世" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("is_living", option.value)}
                      className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                        form.is_living === option.value
                          ? "border-[#c8953f] bg-[#c8953f]/10 text-[#c8953f]"
                          : "border-[#e8e0d4] text-[#8a7a65] hover:border-[#c8953f]/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
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
                  <Label className="text-[#5c4a32]">现居地</Label>
                  <Input
                    value={form.current_location}
                    onChange={(e) => updateField("current_location", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">职业</Label>
                  <Input
                    value={form.occupation}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#5c4a32]">学历</Label>
                  <Input
                    value={form.education}
                    onChange={(e) => updateField("education", e.target.value)}
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

              {/* 故事/回忆编辑器 */}
              <div className="space-y-4 pt-4 border-t border-[#e8e0d4]">
                <div className="flex items-center justify-between">
                  <Label className="text-[#5c4a32] flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#c8953f]" />
                    生平故事 / 回忆
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setStories([...stories, { title: "", year: null, content: "" }])}
                    className="border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    添加故事
                  </Button>
                </div>

                <div className="space-y-3">
                  {stories.map((story, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-[#e8e0d4] bg-[#faf8f3] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <Input
                            placeholder="故事标题"
                            value={story.title}
                            onChange={(e) => {
                              const newStories = [...stories];
                              newStories[index].title = e.target.value;
                              setStories(newStories);
                            }}
                            className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                          />
                          <Input
                            type="number"
                            placeholder="年份"
                            value={story.year || ""}
                            onChange={(e) => {
                              const newStories = [...stories];
                              newStories[index].year = e.target.value ? parseInt(e.target.value) : null;
                              setStories(newStories);
                            }}
                            className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newStories = stories.filter((_, i) => i !== index);
                            setStories(newStories);
                          }}
                          className="ml-2 p-1.5 text-[#8a7a65] hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <textarea
                        placeholder="写下这个故事的细节..."
                        value={story.content}
                        onChange={(e) => {
                          const newStories = [...stories];
                          newStories[index].content = e.target.value;
                          setStories(newStories);
                        }}
                        className="w-full rounded-md border border-[#e8e0d4] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8953f] min-h-[80px] resize-none"
                      />
                    </div>
                  ))}
                </div>

                {stories.length === 0 && (
                  <p className="text-sm text-[#8a7a65] text-center py-4">
                    还没有故事，点击上方按钮添加
                  </p>
                )}
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
