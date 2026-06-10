import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { FamilyTreeEnhanced } from "./family-tree-enhanced";
import { MemberList } from "./member-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, Share2, Users, Download, Clock, ImageIcon, MapPin, Upload, BarChart3, Bell, LogIn, Link2 } from "lucide-react";

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // 查询家族
  const { data: family } = await supabase
    .from("families")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!family) {
    notFound();
  }

  // 查询成员
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .eq("family_id", family.id)
    .order("generation", { ascending: true })
    .order("order_in_siblings", { ascending: true });

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <header className="border-b border-[#e8e0d4] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold text-[#5c4a32]">家承</Link>
            <span className="text-[#e8e0d4]">/</span>
            <h1 className="text-lg font-semibold text-[#5c4a32]">{family.name}</h1>
          </div>
          <div className="flex items-center gap-1">
            {/* 桌面端完整按钮 */}
            <div className="hidden sm:flex items-center gap-1">
              <Link href={`/f/${slug}/members`}>
                <Button variant="ghost" size="sm" className="text-[#8a7a65]">
                  <Users className="mr-1 h-4 w-4" />
                  成员
                </Button>
              </Link>
              <Link href={`/f/${slug}/timeline`}>
                <Button variant="ghost" size="sm" className="text-[#8a7a65]">
                  <Clock className="mr-1 h-4 w-4" />
                  时间轴
                </Button>
              </Link>
              <Link href={`/f/${slug}/photos`}>
                <Button variant="ghost" size="sm" className="text-[#8a7a65]">
                  <ImageIcon className="mr-1 h-4 w-4" />
                  相册
                </Button>
              </Link>
              <Link href={`/f/${slug}/map`}>
                <Button variant="ghost" size="sm" className="text-[#8a7a65]">
                  <MapPin className="mr-1 h-4 w-4" />
                  迁徙
                </Button>
              </Link>
              <Link href={`/f/${slug}/stats`}>
                <Button variant="ghost" size="sm" className="text-[#8a7a65]">
                  <BarChart3 className="mr-1 h-4 w-4" />
                  统计
                </Button>
              </Link>
              <Link href={`/f/${slug}/reminders`}>
                <Button variant="ghost" size="sm" className="text-[#8a7a65]">
                  <Bell className="mr-1 h-4 w-4" />
                  纪念日
                </Button>
              </Link>
              <Link href={`/f/${slug}/invite`}>
                <Button variant="ghost" size="sm" className="text-[#8a7a65]">
                  <Share2 className="mr-1 h-4 w-4" />
                  邀请协作
                </Button>
              </Link>
              <Link href={`/f/${slug}/share`}>
                <Button variant="ghost" size="sm" className="text-[#c8953f] border border-[#c8953f]/30">
                  <Link2 className="mr-1 h-4 w-4" />
                  分享家族
                </Button>
              </Link>
              <Link href={`/f/${slug}/export`}>
                <Button variant="ghost" size="sm" className="text-[#8a7a65]">
                  <Download className="mr-1 h-4 w-4" />
                  导出
                </Button>
              </Link>
              <Link href={`/f/${slug}/import`}>
                <Button variant="ghost" size="sm" className="text-[#8a7a65]">
                  <Upload className="mr-1 h-4 w-4" />
                  导入
                </Button>
              </Link>
              <Link href={`/f/${slug}/settings`}>
                <Button variant="ghost" size="icon" className="text-[#8a7a65]">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/family-login`}>
                <Button variant="ghost" size="sm" className="text-[#c8953f] border border-[#c8953f]/30">
                  <LogIn className="mr-1 h-4 w-4" />
                  家属登录
                </Button>
              </Link>
            </div>
            
            {/* 移动端简化按钮 */}
            <div className="flex sm:hidden items-center gap-1">
              <Link href={`/f/${slug}/members`}>
                <Button variant="ghost" size="icon" className="text-[#8a7a65] h-9 w-9">
                  <Users className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/timeline`}>
                <Button variant="ghost" size="icon" className="text-[#8a7a65] h-9 w-9">
                  <Clock className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/photos`}>
                <Button variant="ghost" size="icon" className="text-[#8a7a65] h-9 w-9">
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/map`}>
                <Button variant="ghost" size="icon" className="text-[#8a7a65] h-9 w-9">
                  <MapPin className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/stats`}>
                <Button variant="ghost" size="icon" className="text-[#8a7a65] h-9 w-9">
                  <BarChart3 className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/reminders`}>
                <Button variant="ghost" size="icon" className="text-[#8a7a65] h-9 w-9">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/invite`}>
                <Button variant="ghost" size="icon" className="text-[#8a7a65] h-9 w-9">
                  <Share2 className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/share`}>
                <Button variant="ghost" size="icon" className="text-[#c8953f] h-9 w-9 border border-[#c8953f]/30">
                  <Link2 className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/export`}>
                <Button variant="ghost" size="icon" className="text-[#8a7a65] h-9 w-9">
                  <Download className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/import`}>
                <Button variant="ghost" size="icon" className="text-[#8a7a65] h-9 w-9">
                  <Upload className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/f/${slug}/family-login`}>
                <Button variant="ghost" size="icon" className="text-[#c8953f] h-9 w-9 border border-[#c8953f]/30">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* 家族信息 */}
        <div className="mb-6 rounded-xl bg-white border border-[#e8e0d4] p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#5c4a32]">{family.name}</h2>
              {family.origin && (
                <p className="mt-1 text-sm text-[#8a7a65]">祖籍：{family.origin}</p>
              )}
              {family.description && (
                <p className="mt-2 text-[#5c4a32]/80">{family.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-[#8a7a65]">
                {members?.length || 0} 位成员
              </p>
            </div>
          </div>
        </div>

        {/* 族谱树 */}
        <div className="mb-6">
          <FamilyTreeEnhanced members={members || []} familySlug={slug} isAdmin={true} />
        </div>

        {/* 成员列表 */}
        <MemberList members={members || []} familySlug={slug} />
      </main>
    </div>
  );
}
