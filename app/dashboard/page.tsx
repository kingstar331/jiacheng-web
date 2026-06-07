import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, Users, Settings } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 查询用户创建的家族
  const { data: myFamilies } = await supabase
    .from("families")
    .select("*")
    .eq("admin_id", user.id);

  // 查询用户协作的家族
  const { data: collabFamilies } = await supabase
    .from("family_collaborators")
    .select("family_id, role, families(id, name, slug, description)")
    .eq("user_id", user.id);

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <header className="border-b border-[#e8e0d4] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-[#5c4a32]">
            家承
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8a7a65]">{user.email}</span>
            <form action="/auth/logout" method="post">
              <Button variant="ghost" size="sm" className="text-[#8a7a65]">
                退出
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#5c4a32]">我的家族</h1>
            <p className="text-[#8a7a65]">管理您创建或参与的家族</p>
          </div>
          <Link href="/onboarding">
            <Button className="bg-[#c8953f] hover:bg-[#b08435] text-white">
              <Plus className="mr-2 h-4 w-4" />
              创建家族
            </Button>
          </Link>
        </div>

        {/* 我创建的家族 */}
        {myFamilies && myFamilies.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-[#5c4a32]">我创建的</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myFamilies.map((family) => (
                <Card key={family.id} className="border-[#e8e0d4] bg-white hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-[#5c4a32]">{family.name}</CardTitle>
                    <CardDescription className="text-[#8a7a65]">
                      {family.description || "暂无描述"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/f/${family.slug}`} className="flex-1">
                        <Button variant="outline" className="w-full border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10">
                          <Users className="mr-2 h-4 w-4" />
                          进入族谱
                        </Button>
                      </Link>
                      <Link href={`/f/${family.slug}/settings`}>
                        <Button variant="ghost" size="icon" className="text-[#8a7a65]">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 我协作的家族 */}
        {collabFamilies && collabFamilies.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-[#5c4a32]">我参与的</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collabFamilies.map((item: any) => (
                <Card key={item.family_id} className="border-[#e8e0d4] bg-white hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-[#5c4a32]">{item.families.name}</CardTitle>
                    <CardDescription className="text-[#8a7a65]">
                      {item.families.description || "暂无描述"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/f/${item.families.slug}`}>
                      <Button variant="outline" className="w-full border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10">
                        <Users className="mr-2 h-4 w-4" />
                        进入族谱
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {(!myFamilies || myFamilies.length === 0) && (!collabFamilies || collabFamilies.length === 0) && (
          <Card className="border-[#e8e0d4] bg-white/80 py-12 text-center">
            <CardContent>
              <Users className="mx-auto mb-4 h-12 w-12 text-[#c8953f]/40" />
              <h3 className="mb-2 text-lg font-semibold text-[#5c4a32]">还没有家族</h3>
              <p className="mb-6 text-[#8a7a65]">创建您的第一个家族，开始记录家族记忆</p>
              <Link href="/onboarding">
                <Button className="bg-[#c8953f] hover:bg-[#b08435] text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  创建家族
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
