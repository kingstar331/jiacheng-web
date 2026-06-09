"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Upload, FileJson, AlertTriangle, Check, Loader2 } from "lucide-react";

interface ImportMember {
  name: string;
  gender?: string;
  birth_year?: number;
  death_year?: number;
  birth_date?: string;
  death_date?: string;
  birthplace?: string;
  current_location?: string;
  occupation?: string;
  education?: string;
  bio?: string;
  stories?: any[];
  generation?: number;
  is_living?: boolean;
  parent_id?: string;
  spouse_id?: string;
  order_in_siblings?: number;
}

interface ImportData {
  family?: {
    name?: string;
    origin?: string;
    description?: string;
  };
  members?: ImportMember[];
}

export default function ImportPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [previewMembers, setPreviewMembers] = useState<ImportMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data: ImportData = JSON.parse(event.target?.result as string);
        setImportData(data);

        // 解析成员数据
        const members = data.members || [];
        setPreviewMembers(members);
        setLoading(false);
      } catch (err) {
        setError("JSON 格式错误，请检查文件内容");
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!previewMembers.length) return;

    setImporting(true);
    setError("");

    const supabase = createClient();

    // 获取家族 ID
    const { data: familyData } = await supabase
      .from("families")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!familyData) {
      setError("家族不存在");
      setImporting(false);
      return;
    }

    const familyId = familyData.id;

    // 用于映射旧 ID 到新 ID
    const idMapping: Record<string, string> = {};

    // 第一步：创建所有成员（不含 parent_id/spouse_id）
    for (const member of previewMembers) {
      const { data: newMember, error: insertError } = await supabase
        .from("members")
        .insert({
          family_id: familyId,
          name: member.name,
          gender: member.gender === "男" ? 1 : member.gender === "女" ? 2 : 0,
          birth_year: member.birth_year || null,
          death_year: member.death_year || null,
          birth_date: member.birth_date || null,
          death_date: member.death_date || null,
          birthplace: member.birthplace || null,
          current_location: member.current_location || null,
          occupation: member.occupation || null,
          education: member.education || null,
          bio: member.bio || null,
          stories: member.stories?.length ? JSON.stringify(member.stories) : null,
          generation: member.generation || 1,
          is_living: member.is_living !== false,
          order_in_siblings: member.order_in_siblings || 0,
        })
        .select("id")
        .single();

      if (insertError) {
        setError(`导入失败：${member.name} - ${insertError.message}`);
        setImporting(false);
        return;
      }

      // 保存 ID 映射（使用 name 作为临时标识）
      idMapping[member.name] = newMember.id;
    }

    // 第二步：更新关系（parent_id, spouse_id）
    for (const member of previewMembers) {
      const newId = idMapping[member.name];
      if (!newId) continue;

      const updates: any = {};

      // 查找父母的 name 对应的新 ID
      if (member.parent_id) {
        const parentMember = previewMembers.find(
          (m) => m.name === member.parent_id || m.name === member.parent_id
        );
        if (parentMember && idMapping[parentMember.name]) {
          updates.parent_id = idMapping[parentMember.name];
        }
      }

      // 查找配偶
      if (member.spouse_id) {
        const spouseMember = previewMembers.find(
          (m) => m.name === member.spouse_id
        );
        if (spouseMember && idMapping[spouseMember.name]) {
          updates.spouse_id = idMapping[spouseMember.name];
        }
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from("members").update(updates).eq("id", newId);
      }
    }

    setSuccess(`成功导入 ${previewMembers.length} 位成员！`);
    setImporting(false);

    // 3 秒后刷新页面
    setTimeout(() => {
      router.push(`/f/${slug}`);
      router.refresh();
    }, 3000);
  };

  const validateData = (): string[] => {
    const issues: string[] = [];

    previewMembers.forEach((member, index) => {
      if (!member.name) {
        issues.push(`第 ${index + 1} 位成员缺少姓名`);
      }
      if (member.birth_year && member.death_year && member.birth_year > member.death_year) {
        issues.push(`${member.name || `第 ${index + 1} 位`}：出生年份大于逝世年份`);
      }
    });

    return issues;
  };

  const validationIssues = validateData();

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <Link href={`/f/${slug}`} className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回家族
        </Link>

        <h1 className="text-2xl font-bold text-[#5c4a32] mb-2">导入家族数据</h1>
        <p className="text-sm text-[#8a7a65] mb-8">
          从 JSON 文件恢复家族数据，支持批量导入成员
        </p>

        {/* 上传区域 */}
        {!importData && (
          <Card className="border-[#e8e0d4] bg-white">
            <CardContent className="p-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#e8e0d4] rounded-xl p-12 text-center cursor-pointer hover:border-[#c8953f] hover:bg-[#faf8f3] transition-colors"
              >
                <FileJson className="h-12 w-12 text-[#c8953f] mx-auto mb-4" />
                <p className="text-lg font-medium text-[#5c4a32]">点击上传 JSON 文件</p>
                <p className="text-sm text-[#8a7a65] mt-2">
                  支持从家承导出的 JSON 文件，或其他符合格式的数据
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* 格式说明 */}
              <div className="mt-6 p-4 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
                <h3 className="text-sm font-medium text-[#5c4a32] mb-2">支持的 JSON 格式</h3>
                <pre className="text-xs text-[#8a7a65] overflow-x-auto">
{`{
  "family": {
    "name": "金氏家族",
    "origin": "湖北枣阳"
  },
  "members": [
    {
      "name": "金如香",
      "gender": "男",
      "birth_year": 1931,
      "generation": 1,
      "bio": "家族创始人"
    }
  ]
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 预览区域 */}
        {importData && (
          <div className="space-y-6">
            {/* 数据概览 */}
            <Card className="border-[#e8e0d4] bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-[#5c4a32]">数据预览</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-[#faf8f3]">
                    <div className="text-2xl font-bold text-[#c8953f]">{previewMembers.length}</div>
                    <div className="text-xs text-[#8a7a65]">成员数</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[#faf8f3]">
                    <div className="text-2xl font-bold text-[#c8953f]">
                      {Math.max(...previewMembers.map((m) => m.generation || 1), 0)}
                    </div>
                    <div className="text-xs text-[#8a7a65]">代数</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[#faf8f3]">
                    <div className="text-2xl font-bold text-[#c8953f]">
                      {previewMembers.filter((m) => m.stories?.length).length}
                    </div>
                    <div className="text-xs text-[#8a7a65]">有故事</div>
                  </div>
                </div>

                {/* 校验警告 */}
                {validationIssues.length > 0 && (
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">发现 {validationIssues.length} 个问题</span>
                    </div>
                    <ul className="space-y-1">
                      {validationIssues.map((issue, i) => (
                        <li key={i} className="text-xs text-yellow-700">
                          • {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 成员列表 */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {previewMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-[#e8e0d4] hover:bg-[#faf8f3]">
                      <div className="w-8 h-8 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-sm font-bold text-[#c8953f]">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#5c4a32]">{member.name || "（未命名）"}</span>
                          <span className="text-xs text-[#8a7a65]">
                            第{member.generation || 1}代
                          </span>
                        </div>
                        <div className="text-xs text-[#8a7a65] truncate">
                          {member.birth_year && `${member.birth_year}年`}
                          {member.birthplace && ` · ${member.birthplace}`}
                          {member.occupation && ` · ${member.occupation}`}
                        </div>
                      </div>
                      {member.stories && member.stories.length > 0 && (
                        <span className="text-xs text-[#c8953f]">{member.stories.length} 个故事</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                onClick={handleImport}
                disabled={importing || validationIssues.some((i) => i.includes("缺少姓名"))}
                className="flex-1 bg-[#c8953f] hover:bg-[#b08435] text-white"
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    导入中...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    确认导入
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => { setImportData(null); setPreviewMembers([]); }}>
                重新选择
              </Button>
            </div>

            {success && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800">{success}</span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
