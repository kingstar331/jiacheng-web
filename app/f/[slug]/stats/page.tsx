"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  User,
  UserCheck,
  MapPin,
  Briefcase,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  gender: number;
  birth_year?: number;
  death_year?: number;
  current_location?: string;
  occupation?: string;
  generation: number;
  is_living: boolean;
  bio?: string;
  created_at: string;
}

export default function StatsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [members, setMembers] = useState<Member[]>([]);
  const [family, setFamily] = useState<any>(null);
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
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("family_id", familyData.id)
        .order("generation", { ascending: true });

      if (data) setMembers(data);
    }
    setLoading(false);
  }

  // 统计数据计算
  const stats = {
    total: members.length,
    male: members.filter((m) => m.gender === 1).length,
    female: members.filter((m) => m.gender === 2).length,
    unknown: members.filter((m) => m.gender === 0).length,
    living: members.filter((m) => m.is_living).length,
    deceased: members.filter((m) => !m.is_living).length,
    generations: Math.max(...members.map((m) => m.generation), 0),
    avgAge: 0,
  };

  // 平均年龄（仅计算在世且有出生年份的）
  const livingWithBirthYear = members.filter((m) => m.is_living && m.birth_year);
  if (livingWithBirthYear.length > 0) {
    const currentYear = new Date().getFullYear();
    const totalAge = livingWithBirthYear.reduce((sum, m) => sum + (currentYear - (m.birth_year || currentYear)), 0);
    stats.avgAge = Math.round(totalAge / livingWithBirthYear.length);
  }

  // 代际分布
  const generationDistribution = members.reduce((acc, m) => {
    acc[m.generation] = (acc[m.generation] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // 地理分布
  const locationDistribution = members.reduce((acc, m) => {
    const loc = m.current_location || "未知";
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 职业分布
  const occupationDistribution = members.reduce((acc, m) => {
    const occ = m.occupation || "未填写";
    acc[occ] = (acc[occ] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 出生年代分布
  const decadeDistribution = members.reduce((acc, m) => {
    if (m.birth_year) {
      const decade = Math.floor(m.birth_year / 10) * 10;
      acc[decade] = (acc[decade] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  // 排序函数
  const sortByValue = (obj: Record<string, number>) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <div className="text-[#8a7a65]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/f/${slug}`}
          className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回家族
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#5c4a32]">家族统计</h1>
            <p className="text-sm text-[#8a7a65] mt-1">
              {family?.name} · 数据洞察
            </p>
          </div>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-[#e8e0d4] bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8a7a65]">总人数</p>
                  <p className="text-3xl font-bold text-[#c8953f]">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-[#c8953f]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e8e0d4] bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8a7a65]">代数</p>
                  <p className="text-3xl font-bold text-[#c8953f]">{stats.generations}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#c8953f]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e8e0d4] bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8a7a65]">在世</p>
                  <p className="text-3xl font-bold text-green-600">{stats.living}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e8e0d4] bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8a7a65]">平均年龄</p>
                  <p className="text-3xl font-bold text-[#c8953f]">
                    {stats.avgAge || "—"}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-[#c8953f]/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* 性别分布 */}
          <Card className="border-[#e8e0d4] bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
                <User className="h-5 w-5 text-[#c8953f]" />
                性别分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "男", count: stats.male, color: "bg-blue-500" },
                  { label: "女", count: stats.female, color: "bg-pink-500" },
                  { label: "未知", count: stats.unknown, color: "bg-gray-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-[#5c4a32]">{item.label}</span>
                      <span className="text-[#8a7a65]">
                        {item.count} 人 ({stats.total ? Math.round((item.count / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#e8e0d4] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all`}
                        style={{
                          width: stats.total ? `${(item.count / stats.total) * 100}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 代际分布 */}
          <Card className="border-[#e8e0d4] bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#c8953f]" />
                代际分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(generationDistribution).map(([gen, count]) => (
                  <div key={gen}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-[#5c4a32]">第 {gen} 代</span>
                      <span className="text-[#8a7a65]">{count} 人</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#e8e0d4] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#c8953f] transition-all"
                        style={{
                          width: `${(count / stats.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 地理分布 */}
          <Card className="border-[#e8e0d4] bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#c8953f]" />
                地理分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sortByValue(locationDistribution).slice(0, 8).map(([loc, count]) => (
                  <div
                    key={loc}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf8f3]"
                  >
                    <span className="text-sm text-[#5c4a32]">{loc}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 rounded-full bg-[#c8953f]" style={{ width: `${count * 8}px` }} />
                      <span className="text-sm text-[#8a7a65] w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 出生年代 */}
          <Card className="border-[#e8e0d4] bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#c8953f]" />
                出生年代
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(decadeDistribution)
                  .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                  .map(([decade, count]) => (
                    <div
                      key={decade}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf8f3]"
                    >
                      <span className="text-sm text-[#5c4a32]">{decade}年代</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full bg-[#c8953f]"
                          style={{ width: `${Math.min(count * 12, 120)}px` }}
                        />
                        <span className="text-sm text-[#8a7a65] w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 职业分布 */}
        {Object.keys(occupationDistribution).length > 0 && (
          <Card className="border-[#e8e0d4] bg-white mb-8">
            <CardHeader>
              <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#c8953f]" />
                职业分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sortByValue(occupationDistribution).map(([occ, count]) => (
                  <div
                    key={occ}
                    className="px-3 py-1.5 rounded-full bg-[#faf8f3] border border-[#e8e0d4] text-sm"
                  >
                    <span className="text-[#5c4a32]">{occ}</span>
                    <span className="text-[#c8953f] ml-1">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 家族时间线 */}
        <Card className="border-[#e8e0d4] bg-white">
          <CardHeader>
            <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
              <PieChart className="h-5 w-5 text-[#c8953f]" />
              家族概览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-lg bg-[#faf8f3]">
                <div className="text-2xl font-bold text-[#c8953f]">
                  {members.filter((m) => m.birth_year && m.birth_year < 1950).length}
                </div>
                <div className="text-xs text-[#8a7a65]">建国前出生</div>
              </div>
              <div className="p-4 rounded-lg bg-[#faf8f3]">
                <div className="text-2xl font-bold text-[#c8953f]">
                  {members.filter((m) => m.current_location?.includes("深圳")).length}
                </div>
                <div className="text-xs text-[#8a7a65]">在深圳</div>
              </div>
              <div className="p-4 rounded-lg bg-[#faf8f3]">
                <div className="text-2xl font-bold text-[#c8953f]">
                  {members.filter((m) => m.occupation).length}
                </div>
                <div className="text-xs text-[#8a7a65]">有职业记录</div>
              </div>
              <div className="p-4 rounded-lg bg-[#faf8f3]">
                <div className="text-2xl font-bold text-[#c8953f]">
                  {members.filter((m) => m.bio).length}
                </div>
                <div className="text-xs text-[#8a7a65]">有生平简介</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
