"use client";

import { Member } from "@/lib/supabase";
import Link from "next/link";
import { User, Plus, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberListProps {
  members: Member[];
  familySlug: string;
}

export function MemberList({ members, familySlug }: MemberListProps) {
  return (
    <div className="rounded-xl bg-white border border-[#e8e0d4] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8e0d4] bg-[#faf8f3]">
        <h3 className="font-semibold text-[#5c4a32]">成员列表</h3>
        <div className="flex items-center gap-2">
          <Link href={`/f/${familySlug}/members/bulk-edit`}>
            <Button variant="outline" size="sm" className="border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10">
              <Edit3 className="mr-1 h-4 w-4" />
              批量编辑
            </Button>
          </Link>
          <Link href={`/f/${familySlug}/members/new`}>
            <Button size="sm" className="bg-[#c8953f] hover:bg-[#b08435] text-white">
              <Plus className="mr-1 h-4 w-4" />
              添加成员
            </Button>
          </Link>
        </div>
      </div>

      <div className="divide-y divide-[#e8e0d4]">
        {members.length === 0 ? (
          <div className="px-4 py-8 text-center text-[#8a7a65]">
            <User className="mx-auto mb-2 h-8 w-8 text-[#c8953f]/30" />
            <p>还没有成员，点击上方按钮添加</p>
          </div>
        ) : (
          members.map((member) => (
            <Link
              key={member.id}
              href={`/f/${familySlug}/members/${member.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#faf8f3] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f] shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#5c4a32]">{member.name}</span>
                  {member.gender === 1 && <span className="text-xs text-blue-500">男</span>}
                  {member.gender === 2 && <span className="text-xs text-pink-500">女</span>}
                </div>
                <p className="text-sm text-[#8a7a65] truncate">
                  {member.occupation || member.birthplace || "暂无信息"}
                </p>
              </div>
              <div className="text-right shrink-0">
                {member.birth_year && (
                  <p className="text-xs text-[#8a7a65]">{member.birth_year}年</p>
                )}
                <p className="text-xs text-[#8a7a65]">第{member.generation}代</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
