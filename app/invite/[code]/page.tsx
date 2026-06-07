import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  // 检查当前用户
  const { data: { user } } = await supabase.auth.getUser();

  // 查询邀请
  const { data: invite } = await supabase
    .from("invitations")
    .select("*, families(id, name, slug)")
    .eq("code", code)
    .single();

  if (!invite) {
    notFound();
  }

  // 检查是否过期
  if (new Date(invite.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-[#e8e0d4] bg-white text-center">
          <CardHeader>
            <CardTitle className="text-[#5c4a32]">邀请已过期</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#8a7a65]">该邀请链接已超过7天有效期</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 已使用
  if (invite.used_by) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-[#e8e0d4] bg-white text-center">
          <CardHeader>
            <CardTitle className="text-[#5c4a32]">邀请已被使用</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#8a7a65]">该邀请链接已被使用</p>
            <Link href={`/f/${invite.families.slug}`}>
              <Button className="mt-4 bg-[#c8953f] hover:bg-[#b08435] text-white">
                进入家族
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 未登录则跳转登录
  if (!user) {
    redirect(`/auth/login?next=/invite/${code}`);
  }

  // 接受邀请：添加协作者
  const { error } = await supabase.from("family_collaborators").insert({
    family_id: invite.family_id,
    user_id: user.id,
    role: invite.role,
  });

  if (error && error.code !== "23505") {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-[#e8e0d4] bg-white text-center">
          <CardHeader>
            <CardTitle className="text-[#5c4a32]">加入失败</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 标记邀请已使用
  await supabase
    .from("invitations")
    .update({ used_by: user.id, used_at: new Date().toISOString() })
    .eq("id", invite.id);

  redirect(`/f/${invite.families.slug}`);
}
