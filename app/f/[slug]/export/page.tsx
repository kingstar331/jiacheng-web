"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Download, FileJson, FileSpreadsheet, Printer, Check } from "lucide-react";

export default function ExportPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [family, setFamily] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    loadData();
  }, [slug]);

  async function loadData() {
    const supabase = createClient();
    
    const { data: familyData } = await supabase
      .from("families")
      .select("*")
      .eq("slug", slug)
      .single();
    
    if (familyData) {
      setFamily(familyData);
      
      const { data: membersData } = await supabase
        .from("members")
        .select("*")
        .eq("family_id", familyData.id)
        .order("generation", { ascending: true })
        .order("order_in_siblings", { ascending: true });
      
      if (membersData) {
        setMembers(membersData);
      }
    }
    
    setLoading(false);
  }

  function exportToJSON() {
    if (!family || !members.length) return;

    const exportData = {
      export_date: new Date().toISOString(),
      family: {
        name: family.name,
        slug: family.slug,
        origin: family.origin,
        description: family.description,
        created_at: family.created_at,
      },
      members: members.map(m => ({
        name: m.name,
        gender: m.gender === 1 ? "男" : m.gender === 2 ? "女" : "未知",
        birth_year: m.birth_year,
        death_year: m.death_year,
        birth_date: m.birth_date,
        death_date: m.death_date,
        birthplace: m.birthplace,
        current_location: m.current_location,
        occupation: m.occupation,
        education: m.education,
        bio: m.bio,
        stories: m.stories ? JSON.parse(m.stories) : [],
        generation: m.generation,
        is_living: m.is_living,
        parent_id: m.parent_id,
        spouse_id: m.spouse_id,
        order_in_siblings: m.order_in_siblings,
      })),
      statistics: {
        total_members: members.length,
        generations: Math.max(...members.map(m => m.generation)),
        living_members: members.filter(m => m.is_living).length,
        deceased_members: members.filter(m => !m.is_living).length,
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${family.name}_族谱数据_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  function exportToCSV() {
    if (!family || !members.length) return;

    // CSV 头部
    const headers = ["姓名", "性别", "出生年份", "逝世年份", "出生地", "现居地", "职业", "学历", "代数", "生存状态", "生平简介"];
    
    // CSV 内容
    const rows = members.map(m => [
      m.name,
      m.gender === 1 ? "男" : m.gender === 2 ? "女" : "未知",
      m.birth_year || "",
      m.death_year || "",
      m.birthplace || "",
      m.current_location || "",
      m.occupation || "",
      m.education || "",
      `第${m.generation}代`,
      m.is_living ? "在世" : "已逝世",
      m.bio || "",
    ]);

    // 转义 CSV 字段
    const escapeCSV = (field: string) => {
      if (field.includes(",") || field.includes("\n") || field.includes('"')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${family.name}_族谱数据_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  function printFamilyTree() {
    window.open(`/f/${slug}/print`, "_blank");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <div className="text-[#8a7a65]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/f/${slug}`}
          className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回家族
        </Link>

        <h1 className="text-2xl font-bold text-[#5c4a32] mb-2">导出家族数据</h1>
        <p className="text-[#8a7a65] mb-8">
          将家族数据导出为不同格式，便于备份和分享
        </p>

        {/* 统计信息 */}
        <Card className="border-[#e8e0d4] bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#5c4a32]">家族统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-[#faf8f3]">
                <div className="text-2xl font-bold text-[#c8953f]">{members.length}</div>
                <div className="text-xs text-[#8a7a65]">总人数</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-[#faf8f3]">
                <div className="text-2xl font-bold text-[#c8953f]">
                  {Math.max(...members.map(m => m.generation), 0)}
                </div>
                <div className="text-xs text-[#8a7a65]">代数</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-[#faf8f3]">
                <div className="text-2xl font-bold text-[#c8953f]">
                  {members.filter(m => m.is_living).length}
                </div>
                <div className="text-xs text-[#8a7a65]">在世</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-[#faf8f3]">
                <div className="text-2xl font-bold text-[#c8953f]">
                  {members.filter(m => !m.is_living).length}
                </div>
                <div className="text-xs text-[#8a7a65]">已逝世</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 导出选项 */}
        <div className="space-y-4">
          {/* JSON 导出 */}
          <Card className="border-[#e8e0d4] bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c8953f]/10 flex items-center justify-center">
                    <FileJson className="h-6 w-6 text-[#c8953f]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#5c4a32]">导出为 JSON</h3>
                    <p className="text-sm text-[#8a7a65] mt-1">
                      包含完整数据：成员信息、故事、关系等<br/>
                      适合备份和数据迁移
                    </p>
                  </div>
                </div>
                <Button
                  onClick={exportToJSON}
                  className="bg-[#c8953f] hover:bg-[#b08435] text-white"
                >
                  {exported ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Download className="h-4 w-4 mr-1" />
                  )}
                  {exported ? "已导出" : "导出"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CSV 导出 */}
          <Card className="border-[#e8e0d4] bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c8953f]/10 flex items-center justify-center">
                    <FileSpreadsheet className="h-6 w-6 text-[#c8953f]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#5c4a32]">导出为 Excel/CSV</h3>
                    <p className="text-sm text-[#8a7a65] mt-1">
                      表格格式，可用 Excel 打开<br/>
                      适合查看和打印
                    </p>
                  </div>
                </div>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10"
                >
                  {exported ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Download className="h-4 w-4 mr-1" />
                  )}
                  {exported ? "已导出" : "导出"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 打印族谱 */}
          <Card className="border-[#e8e0d4] bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c8953f]/10 flex items-center justify-center">
                    <Printer className="h-6 w-6 text-[#c8953f]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#5c4a32]">打印族谱</h3>
                    <p className="text-sm text-[#8a7a65] mt-1">
                      打开打印友好的族谱页面<br/>
                      可保存为 PDF 或打印成册
                    </p>
                  </div>
                </div>
                <Button
                  onClick={printFamilyTree}
                  variant="outline"
                  className="border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10"
                >
                  <Printer className="h-4 w-4 mr-1" />
                  打开
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 数据说明 */}
        <div className="mt-8 p-4 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
          <p className="text-sm text-[#8a7a65]">
            <strong className="text-[#5c4a32]">数据安全提示：</strong>
            导出的数据文件包含家族成员的个人信息，请妥善保管，避免泄露。
          </p>
        </div>
      </div>
    </div>
  );
}
