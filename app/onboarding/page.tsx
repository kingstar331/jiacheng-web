"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [origin, setOrigin] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await createClient().auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data, error } = await createClient()
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

    if (error) {
      if (error.code === "23505") {
        setError("家族链接已被占用，请修改");
      } else {
        setError(error.message);
      }
    } else {
      router.push(`/f/${slug}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
      <Card className="w-full max-w-lg border-[#e8e0d4] bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#5c4a32]">创建家族</CardTitle>
          <CardDescription className="text-[#8a7a65]">
            填写基本信息，生成您的专属家族页面
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#5c4a32]">家族名称 *</Label>
              <Input
                id="name"
                placeholder="如：金氏家族"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-[#5c4a32]">家族链接 *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#8a7a65] whitespace-nowrap">jiacheng.app/f/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
                  required
                  pattern="[a-z0-9-]+"
                />
              </div>
              <p className="text-xs text-[#8a7a65]">仅支持小写字母、数字和连字符</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin" className="text-[#5c4a32]">祖籍</Label>
              <Input
                id="origin"
                placeholder="如：湖北枣阳"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="border-[#e8e0d4] focus-visible:ring-[#c8953f]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#5c4a32]">家族简介</Label>
              <textarea
                id="description"
                placeholder="简述家族历史或家训..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-[#e8e0d4] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8953f] min-h-[80px] resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
              disabled={loading}
            >
              {loading ? "创建中..." : "创建家族"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
