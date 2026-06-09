import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, User, MapPin, Briefcase, Calendar, Heart, Users, BookOpen, GraduationCap } from "lucide-react";

export default async function MemberPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const supabase = await createClient();

  // 查询家族
  const { data: family } = await supabase
    .from("families")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!family) notFound();

  // 查询成员
  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .eq("family_id", family.id)
    .single();

  if (!member) notFound();

  // 查询配偶
  const { data: spouse } = member.spouse_id
    ? await supabase.from("members").select("*").eq("id", member.spouse_id).single()
    : { data: null };

  // 查询子女
  const { data: children } = await supabase
    .from("members")
    .select("*")
    .eq("parent_id", member.id);

  // 查询父母
  const { data: parent } = member.parent_id
    ? await supabase.from("members").select("*").eq("id", member.parent_id).single()
    : { data: null };

  const genderText = member.gender === 1 ? "男" : member.gender === 2 ? "女" : "未知";
  const genderColor = member.gender === 1 ? "text-blue-500" : member.gender === 2 ? "text-pink-500" : "text-gray-500";

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/f/${slug}`}
          className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回族谱
        </Link>

        {/* 人物卡片 */}
        <Card className="border-[#e8e0d4] bg-white mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f]">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-[#5c4a32]">{member.name}</CardTitle>
                  <p className={`text-sm ${genderColor}`}>{genderText}</p>
                </div>
              </div>
              <Link href={`/f/${slug}/members/${id}/edit`}>
                <Button variant="outline" size="sm" className="border-[#c8953f] text-[#c8953f]">
                  <Edit className="mr-1 h-4 w-4" />
                  编辑
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 基本信息 */}
            <div className="grid gap-3 sm:grid-cols-2">
              {member.birth_year && (
                <div className="flex items-center gap-2 text-[#5c4a32]">
                  <Calendar className="h-4 w-4 text-[#c8953f]" />
                  <span>
                    {member.birth_year}年{member.death_year ? ` - ${member.death_year}年` : " 生"}
                    {member.death_year && "（已逝）"}
                  </span>
                </div>
              )}
              {member.birthplace && (
                <div className="flex items-center gap-2 text-[#5c4a32]">
                  <MapPin className="h-4 w-4 text-[#c8953f]" />
                  <span>{member.birthplace}</span>
                </div>
              )}
              {member.occupation && (
                <div className="flex items-center gap-2 text-[#5c4a32]">
                  <Briefcase className="h-4 w-4 text-[#c8953f]" />
                  <span>{member.occupation}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[#5c4a32]">
                <User className="h-4 w-4 text-[#c8953f]" />
                <span>第{member.generation}代</span>
              </div>
            </div>

            {/* 生平 */}
            {member.bio && (
              <div className="pt-4 border-t border-[#e8e0d4]">
                <h3 className="text-sm font-medium text-[#5c4a32] mb-2">生平简介</h3>
                <p className="text-[#5c4a32]/80 leading-relaxed">{member.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 关系卡片 */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* 配偶 */}
          {spouse && (
            <Card className="border-[#e8e0d4] bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#5c4a32] flex items-center gap-2">
                  <Heart className="h-4 w-4 text-[#c8953f]" />
                  配偶
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/f/${slug}/members/${spouse.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#e8e0d4] hover:border-[#c8953f] transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#5c4a32]">{spouse.name}</p>
                    {spouse.birth_year && (
                      <p className="text-xs text-[#8a7a65]">{spouse.birth_year}年</p>
                    )}
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* 父母 */}
          {parent && (
            <Card className="border-[#e8e0d4] bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#5c4a32] flex items-center gap-2">
                  <User className="h-4 w-4 text-[#c8953f]" />
                  父母
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/f/${slug}/members/${parent.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#e8e0d4] hover:border-[#c8953f] transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#5c4a32]">{parent.name}</p>
                    {parent.birth_year && (
                      <p className="text-xs text-[#8a7a65]">{parent.birth_year}年</p>
                    )}
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* 子女 */}
          {children && children.length > 0 && (
            <Card className="border-[#e8e0d4] bg-white sm:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#5c4a32] flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#c8953f]" />
                  子女（{children.length}人）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/f/${slug}/members/${child.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#e8e0d4] hover:border-[#c8953f] transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#c8953f]/10 flex items-center justify-center text-[#c8953f]">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-[#5c4a32]">{child.name}</p>
                        {child.birth_year && (
                          <p className="text-xs text-[#8a7a65]">{child.birth_year}年</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        {/* 故事/回忆 */}
        {member.stories && (
          <Card className="border-[#e8e0d4] bg-white mt-6">
            <CardHeader>
              <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#c8953f]" />
                生平故事 / 回忆
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(() => {
                  try {
                    const stories = JSON.parse(member.stories);
                    if (!Array.isArray(stories) || stories.length === 0) return null;
                    
                    // 按年份排序
                    const sorted = [...stories].sort((a: any, b: any) => (a.year || 0) - (b.year || 0));
                    
                    return sorted.map((story: any, index: number) => (
                      <div key={index} className="relative pl-6 border-l-2 border-[#c8953f]/30">
                        {/* 时间轴节点 */}
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#c8953f]" />
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-[#5c4a32]">{story.title}</h3>
                            {story.year && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#c8953f]/10 text-[#c8953f]">
                                {story.year}年
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#5c4a32]/80 leading-relaxed whitespace-pre-wrap">
                            {story.content}
                          </p>
                        </div>
                      </div>
                    ));
                  } catch {
                    return <p className="text-sm text-[#8a7a65]">故事格式错误</p>;
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
