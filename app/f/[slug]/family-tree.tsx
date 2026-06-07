"use client";

import { useState } from "react";
import { Member } from "@/lib/supabase";
import Link from "next/link";
import { ChevronDown, ChevronRight, User, Heart } from "lucide-react";

interface FamilyTreeProps {
  members: Member[];
  familySlug: string;
}

export function FamilyTree({ members, familySlug }: FamilyTreeProps) {
  const [expandedGens, setExpandedGens] = useState<Set<number>>(new Set([1, 2, 3, 4]));

  const toggleGen = (gen: number) => {
    const next = new Set(expandedGens);
    if (next.has(gen)) next.delete(gen);
    else next.add(gen);
    setExpandedGens(next);
  };

  // 按代数分组
  const byGeneration = members.reduce((acc, m) => {
    const gen = m.generation || 1;
    if (!acc[gen]) acc[gen] = [];
    acc[gen].push(m);
    return acc;
  }, {} as Record<number, Member[]>);

  const generations = Object.keys(byGeneration)
    .map(Number)
    .sort((a, b) => a - b);

  // 查找配偶
  const getSpouse = (member: Member) => {
    if (!member.spouse_id) return null;
    return members.find((m) => m.id === member.spouse_id);
  };

  return (
    <div className="rounded-xl bg-white border border-[#e8e0d4] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e8e0d4] bg-[#faf8f3]">
        <h3 className="font-semibold text-[#5c4a32]">家族族谱</h3>
      </div>

      {/* 桌面端：树状图 */}
      <div className="hidden md:block p-6 overflow-x-auto">
        <div className="flex flex-col items-center gap-8 min-w-max">
          {generations.map((gen) => {
            const genMembers = byGeneration[gen];
            return (
              <div key={gen} className="flex flex-col items-center gap-3">
                <span className="text-xs font-medium text-[#c8953f] bg-[#c8953f]/10 px-3 py-1 rounded-full">
                  第{gen}代
                </span>
                <div className="flex items-center gap-6">
                  {genMembers.map((member) => {
                    const spouse = getSpouse(member);
                    // 只渲染男方/女方，配偶并排显示
                    if (member.spouse_id && member.id > member.spouse_id) return null;

                    return (
                      <div key={member.id} className="flex items-center gap-2">
                        <Link
                          href={`/f/${familySlug}/members/${member.id}`}
                          className="flex flex-col items-center gap-1 p-3 rounded-lg border border-[#e8e0d4] bg-white hover:border-[#c8953f] hover:shadow-sm transition-all min-w-[100px]"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f]">
                            <User className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-medium text-[#5c4a32]">{member.name}</span>
                          {member.birth_year && (
                            <span className="text-xs text-[#8a7a65]">{member.birth_year}</span>
                          )}
                        </Link>

                        {spouse && (
                          <>
                            <Heart className="h-3 w-3 text-[#c8953f]" />
                            <Link
                              href={`/f/${familySlug}/members/${spouse.id}`}
                              className="flex flex-col items-center gap-1 p-3 rounded-lg border border-[#e8e0d4] bg-white hover:border-[#c8953f] hover:shadow-sm transition-all min-w-[100px]"
                            >
                              <div className="w-10 h-10 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f]">
                                <User className="h-5 w-5" />
                              </div>
                              <span className="text-sm font-medium text-[#5c4a32]">{spouse.name}</span>
                              {spouse.birth_year && (
                                <span className="text-xs text-[#8a7a65]">{spouse.birth_year}</span>
                              )}
                            </Link>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 移动端：折叠列表 */}
      <div className="md:hidden">
        {generations.map((gen) => {
          const genMembers = byGeneration[gen];
          const isExpanded = expandedGens.has(gen);

          return (
            <div key={gen} className="border-b border-[#e8e0d4] last:border-0">
              <button
                onClick={() => toggleGen(gen)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium text-[#5c4a32]">第{gen}代</span>
                <span className="text-sm text-[#8a7a65]">{genMembers.length}人</span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-[#8a7a65]" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#8a7a65]" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 space-y-2">
                  {genMembers.map((member) => {
                    const spouse = getSpouse(member);
                    if (member.spouse_id && member.id > member.spouse_id) return null;

                    return (
                      <Link
                        key={member.id}
                        href={`/f/${familySlug}/members/${member.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[#e8e0d4] bg-white hover:border-[#c8953f] transition-all"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f]">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#5c4a32]">{member.name}</span>
                            {spouse && (
                              <>
                                <Heart className="h-3 w-3 text-[#c8953f]" />
                                <span className="font-medium text-[#5c4a32]">{spouse.name}</span>
                              </>
                            )}
                          </div>
                          {member.occupation && (
                            <p className="text-xs text-[#8a7a65]">{member.occupation}</p>
                          )}
                        </div>
                        {member.birth_year && (
                          <span className="text-xs text-[#8a7a65]">{member.birth_year}年</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
