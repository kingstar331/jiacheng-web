"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Search, Filter, User, Plus, X } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

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
  avatar_url?: string;
}

export default function MembersPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // 筛选条件
  const [filters, setFilters] = useState({
    generation: "",
    gender: "",
    is_living: "",
    location: "",
  });

  useEffect(() => {
    loadMembers();
  }, [slug]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, members]);

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
        .select("id, name, gender, birth_year, death_year, birthplace, current_location, occupation, generation, is_living, avatar_url")
        .eq("family_id", familyData.id)
        .order("generation", { ascending: true })
        .order("name");

      if (data) {
        setMembers(data);
        setFilteredMembers(data);
      }
    }
    setLoading(false);
  }

  function applyFilters() {
    let result = [...members];

    // 搜索
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.occupation?.toLowerCase().includes(query) ||
          m.birthplace?.toLowerCase().includes(query) ||
          m.current_location?.toLowerCase().includes(query)
      );
    }

    // 代数筛选
    if (filters.generation) {
      result = result.filter((m) => m.generation === parseInt(filters.generation));
    }

    // 性别筛选
    if (filters.gender) {
      result = result.filter((m) => m.gender === parseInt(filters.gender));
    }

    // 生存状态
    if (filters.is_living) {
      result = result.filter((m) => m.is_living === (filters.is_living === "true"));
    }

    // 地点筛选
    if (filters.location) {
      result = result.filter(
        (m) =>
          m.current_location?.includes(filters.location) ||
          m.birthplace?.includes(filters.location)
      );
    }

    setFilteredMembers(result);
  }

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      generation: "",
      gender: "",
      is_living: "",
      location: "",
    });
  };

  const hasActiveFilters = searchQuery || Object.values(filters).some((v) => v !== "");

  // 获取所有代数
  const generations = [...new Set(members.map((m) => m.generation))].sort((a, b) => a - b);

  // 获取所有地点
  const locations = [...new Set(members.map((m) => m.current_location).filter(Boolean))];

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
        <Link href={`/f/${slug}`} className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回家族
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#5c4a32]">成员列表</h1>
            <p className="text-sm text-[#8a7a65] mt-1">
              共 {members.length} 位成员
              {hasActiveFilters && ` · 筛选后 ${filteredMembers.length} 位`}
            </p>
          </div>
          <Link href={`/f/${slug}/members/new`}>
            <Button className="bg-[#c8953f] hover:bg-[#b08435] text-white">
              <Plus className="mr-1 h-4 w-4" />
              添加成员
            </Button>
          </Link>
        </div>

        {/* 搜索栏 */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7a65]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索姓名、职业、地点..."
              className="pl-10 border-[#e8e0d4] focus-visible:ring-[#c8953f]"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`border-[#e8e0d4] ${showFilters ? "bg-[#faf8f3] border-[#c8953f]" : ""}`}
          >
            <Filter className="mr-1 h-4 w-4" />
            筛选
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="text-[#8a7a65]">
              <X className="mr-1 h-4 w-4" />
              清除
            </Button>
          )}
        </div>

        {/* 筛选面板 */}
        {showFilters && (
          <div className="p-4 rounded-lg bg-white border border-[#e8e0d4] mb-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label className="text-sm text-[#5c4a32] mb-1 block">代数</label>
                <select
                  value={filters.generation}
                  onChange={(e) => setFilters({ ...filters, generation: e.target.value })}
                  className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                >
                  <option value="">全部</option>
                  {generations.map((g) => (
                    <option key={g} value={g}>
                      第 {g} 代
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-[#5c4a32] mb-1 block">性别</label>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                >
                  <option value="">全部</option>
                  <option value="1">男</option>
                  <option value="2">女</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[#5c4a32] mb-1 block">生存状态</label>
                <select
                  value={filters.is_living}
                  onChange={(e) => setFilters({ ...filters, is_living: e.target.value })}
                  className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                >
                  <option value="">全部</option>
                  <option value="true">在世</option>
                  <option value="false">已逝世</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[#5c4a32] mb-1 block">现居地</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                >
                  <option value="">全部</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 成员列表 */}
        {filteredMembers.length === 0 ? (
          <EmptyState type="members" familySlug={slug} />
        ) : (
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <Link
                key={member.id}
                href={`/f/${slug}/members/${member.id}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#e8e0d4] hover:border-[#c8953f] hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f] flex-shrink-0">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#5c4a32]">{member.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#faf8f3] text-[#8a7a65]">
                      第{member.generation}代
                    </span>
                    {member.gender === 1 && <span className="text-xs text-blue-500">男</span>}
                    {member.gender === 2 && <span className="text-xs text-pink-500">女</span>}
                    {!member.is_living && (
                      <span className="text-xs text-gray-400">已逝世</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-[#8a7a65]">
                    {member.birth_year && <span>{member.birth_year}年</span>}
                    {member.birthplace && <span>· {member.birthplace}</span>}
                    {member.current_location && <span>· 📍 {member.current_location}</span>}
                    {member.occupation && <span>· {member.occupation}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
