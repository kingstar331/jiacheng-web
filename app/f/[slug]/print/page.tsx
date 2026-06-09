"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Printer, User, Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Member {
  id: string;
  name: string;
  gender: number;
  birth_year?: number;
  death_year?: number;
  birthplace?: string;
  current_location?: string;
  occupation?: string;
  generation: number;
  is_living: boolean;
  bio?: string;
  parent_id?: string;
  spouse_id?: string;
  order_in_siblings?: number;
}

export default function PrintPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [family, setFamily] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (membersData) setMembers(membersData);
    }
    setLoading(false);
  }

  const handlePrint = () => {
    window.print();
  };

  // 按代数分组
  const groupedByGeneration = members.reduce((acc, member) => {
    if (!acc[member.generation]) acc[member.generation] = [];
    acc[member.generation].push(member);
    return acc;
  }, {} as Record<number, Member[]>);

  const generations = Object.keys(groupedByGeneration).map(Number).sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center print:min-h-0">
        <div className="text-[#8a7a65]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] print:bg-white">
      {/* 打印工具栏 - 打印时隐藏 */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-[#e8e0d4] px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#5c4a32]">打印预览</h1>
          <Button onClick={handlePrint} className="bg-[#c8953f] hover:bg-[#b08435] text-white">
            <Printer className="mr-2 h-4 w-4" />
            打印 / 保存PDF
          </Button>
        </div>
      </div>

      {/* 打印内容 */}
      <div className="mx-auto max-w-4xl px-8 py-12 print:p-0 print:max-w-none">
        {/* 封面 */}
        <div className="text-center mb-16 print:mb-12">
          <h1 className="text-4xl font-bold text-[#5c4a32] mb-4">{family?.name}族谱</h1>
          <p className="text-lg text-[#8a7a65] mb-2">{family?.origin && `祖籍：${family.origin}`}</p>
          <p className="text-sm text-[#8a7a65]">共 {members.length} 位成员 · {generations.length} 代人</p>
          <p className="text-sm text-[#c8953f] mt-4 italic">"聚是一团火，散作满天星"</p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-4 gap-4 mb-12 print:mb-8">
          <div className="text-center p-4 border border-[#e8e0d4] rounded-lg">
            <div className="text-2xl font-bold text-[#c8953f]">{members.length}</div>
            <div className="text-xs text-[#8a7a65]">总人数</div>
          </div>
          <div className="text-center p-4 border border-[#e8e0d4] rounded-lg">
            <div className="text-2xl font-bold text-[#c8953f]">{generations.length}</div>
            <div className="text-xs text-[#8a7a65]">代数</div>
          </div>
          <div className="text-center p-4 border border-[#e8e0d4] rounded-lg">
            <div className="text-2xl font-bold text-[#c8953f]">
              {members.filter(m => m.is_living).length}
            </div>
            <div className="text-xs text-[#8a7a65]">在世</div>
          </div>
          <div className="text-center p-4 border border-[#e8e0d4] rounded-lg">
            <div className="text-2xl font-bold text-[#c8953f]">
              {members.filter(m => !m.is_living).length}
            </div>
            <div className="text-xs text-[#8a7a65]">已逝世</div>
          </div>
        </div>

        {/* 按代展示 */}
        {generations.map((gen) => (
          <section key={gen} className="mb-12 print:mb-8 break-inside-avoid">
            <h2 className="text-2xl font-bold text-[#5c4a32] mb-6 pb-2 border-b-2 border-[#c8953f]">
              第 {gen} 代
            </h2>
            <div className="grid gap-4 md:grid-cols-2 print:grid-cols-2">
              {groupedByGeneration[gen].map((member) => (
                <div
                  key={member.id}
                  className="p-4 border border-[#e8e0d4] rounded-lg bg-white print:border-gray-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f] flex-shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#5c4a32]">{member.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#faf8f3] text-[#8a7a65]">
                          {member.gender === 1 ? "男" : member.gender === 2 ? "女" : "未知"}
                        </span>
                        {!member.is_living && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                            已逝世
                          </span>
                        )}
                      </div>

                      <div className="mt-2 space-y-1 text-sm text-[#5c4a32]">
                        {member.birth_year && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#c8953f]" />
                            <span>
                              {member.birth_year}年{member.death_year ? ` - ${member.death_year}年` : " - 至今"}
                            </span>
                          </div>
                        )}
                        {member.birthplace && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#c8953f]" />
                            <span>出生地：{member.birthplace}</span>
                          </div>
                        )}
                        {member.current_location && (
                          <div className="flex items-center gap-1.5">
                            <Heart className="h-3.5 w-3.5 text-[#c8953f]" />
                            <span>现居：{member.current_location}</span>
                          </div>
                        )}
                        {member.occupation && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#c8953f]">职业：</span>
                            <span>{member.occupation}</span>
                          </div>
                        )}
                      </div>

                      {member.bio && (
                        <p className="mt-3 text-sm text-[#8a7a65] leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* 页脚 */}
        <div className="mt-16 pt-8 border-t border-[#e8e0d4] text-center print:mt-12">
          <p className="text-sm text-[#8a7a65]">
            本族谱由「家承」生成 · {new Date().toLocaleDateString("zh-CN")}
          </p>
          <p className="text-xs text-[#8a7a65] mt-1">
            https://jiacheng-web.vercel.app
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          @page {
            margin: 1.5cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}
