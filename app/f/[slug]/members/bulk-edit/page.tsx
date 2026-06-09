"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, Check, Loader2, MapPin, GraduationCap, Briefcase } from "lucide-react";

interface Member {
  id: string;
  name: string;
  generation: number;
  current_location?: string;
  occupation?: string;
  education?: string;
  is_living: boolean;
  selected?: boolean;
}

export default function BulkEditPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  // 批量修改的字段
  const [bulkLocation, setBulkLocation] = useState("");
  const [bulkOccupation, setBulkOccupation] = useState("");
  const [bulkEducation, setBulkEducation] = useState("");
  const [bulkLiving, setBulkLiving] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, [slug]);

  async function loadMembers() {
    const supabase = createClient();

    const { data: familyData } = await supabase
      .from("families")
      .select("id")
      .eq("slug", slug)
      .single();

    if (familyData) {
      const { data } = await supabase
        .from("members")
        .select("id, name, generation, current_location, occupation, education, is_living")
        .eq("family_id", familyData.id)
        .order("generation", { ascending: true })
        .order("name");

      if (data) {
        setMembers(data.map((m) => ({ ...m, selected: false })));
      }
    }

    setLoading(false);
  }

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setMembers(members.map((m) => ({ ...m, selected: newSelectAll })));
  };

  const toggleMember = (id: string) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m))
    );
  };

  const selectedCount = members.filter((m) => m.selected).length;

  const handleSave = async () => {
    if (selectedCount === 0) {
      setError("请至少选择一位成员");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const selectedIds = members.filter((m) => m.selected).map((m) => m.id);

    const updates: any = {};
    if (bulkLocation) updates.current_location = bulkLocation;
    if (bulkOccupation) updates.occupation = bulkOccupation;
    if (bulkEducation) updates.education = bulkEducation;
    if (bulkLiving !== null) updates.is_living = bulkLiving === "true";

    if (Object.keys(updates).length === 0) {
      setError("请至少填写一个要修改的字段");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("members")
      .update(updates)
      .in("id", selectedIds);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(`成功更新 ${selectedCount} 位成员！`);
      // 刷新数据
      loadMembers();
      // 清空表单
      setBulkLocation("");
      setBulkOccupation("");
      setBulkEducation("");
      setBulkLiving(null);
      setSelectAll(false);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <div className="text-[#8a7a65]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <Link href={`/f/${slug}/members`} className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回成员列表
        </Link>

        <h1 className="text-2xl font-bold text-[#5c4a32] mb-2">批量编辑成员</h1>
        <p className="text-sm text-[#8a7a65] mb-8">
          选择多位成员，一次性修改相同字段
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左侧：成员选择 */}
          <div className="lg:col-span-2">
            <Card className="border-[#e8e0d4] bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-[#5c4a32]">
                  选择成员（已选 {selectedCount} 人）
                </CardTitle>
                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                  {selectAll ? "取消全选" : "全选"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        member.selected
                          ? "border-[#c8953f] bg-[#faf8f3]"
                          : "border-[#e8e0d4] hover:border-[#c8953f]/50"
                      }`}
                      onClick={() => toggleMember(member.id)}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          member.selected
                            ? "bg-[#c8953f] border-[#c8953f]"
                            : "border-[#e8e0d4]"
                        }`}
                      >
                        {member.selected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#5c4a32]">{member.name}</span>
                          <span className="text-xs text-[#8a7a65]">第{member.generation}代</span>
                          {!member.is_living && (
                            <span className="text-xs text-gray-400">已逝世</span>
                          )}
                        </div>
                        <div className="text-xs text-[#8a7a65] mt-1">
                          {member.current_location && `📍 ${member.current_location}`}
                          {member.occupation && ` · 💼 ${member.occupation}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：批量修改表单 */}
          <div>
            <Card className="border-[#e8e0d4] bg-white sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg text-[#5c4a32]">批量修改</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5c4a32] flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#c8953f]" />
                    现居地
                  </label>
                  <input
                    type="text"
                    value={bulkLocation}
                    onChange={(e) => setBulkLocation(e.target.value)}
                    placeholder="如：深圳"
                    className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5c4a32] flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#c8953f]" />
                    职业
                  </label>
                  <input
                    type="text"
                    value={bulkOccupation}
                    onChange={(e) => setBulkOccupation(e.target.value)}
                    placeholder="如：工程师"
                    className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5c4a32] flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[#c8953f]" />
                    学历
                  </label>
                  <input
                    type="text"
                    value={bulkEducation}
                    onChange={(e) => setBulkEducation(e.target.value)}
                    placeholder="如：本科"
                    className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5c4a32]">生存状态</label>
                  <select
                    value={bulkLiving || ""}
                    onChange={(e) => setBulkLiving(e.target.value || null)}
                    className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                  >
                    <option value="">不修改</option>
                    <option value="true">在世</option>
                    <option value="false">已逝世</option>
                  </select>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving || selectedCount === 0}
                  className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      保存修改
                    </>
                  )}
                </Button>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">{success}</span>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
                  <p className="text-xs text-[#8a7a65]">
                    💡 提示：留空的字段不会被修改，只更新填写的内容
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
