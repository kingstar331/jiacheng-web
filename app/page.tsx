import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Users, BookOpen, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full bg-[#c8953f]/10 px-4 py-1.5 text-sm font-medium text-[#c8953f]">
            🏛️ 家族数字化传承
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#5c4a32] sm:text-5xl md:text-6xl">
            家承
          </h1>
          <p className="mb-4 text-xl text-[#8a7a65]">
            记录家族，传承记忆
          </p>
          <p className="mb-10 text-base text-[#8a7a65]/80">
            让每个家庭都有自己的数字族谱。从零开始，构建四代人的家族记忆库。
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="bg-[#c8953f] hover:bg-[#b08435] text-white px-8">
                创建我的家族
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10">
                查看示例
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-[#5c4a32]">
            核心功能
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[#e8e0d4] bg-white/80">
              <CardHeader className="pb-3">
                <TreePine className="mb-2 h-8 w-8 text-[#c8953f]" />
                <CardTitle className="text-lg text-[#5c4a32]">可视化族谱</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#8a7a65]">
                  拖拽式族谱编辑器，轻松构建四代家族树
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-[#e8e0d4] bg-white/80">
              <CardHeader className="pb-3">
                <Users className="mb-2 h-8 w-8 text-[#c8953f]" />
                <CardTitle className="text-lg text-[#5c4a32]">人物档案</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#8a7a65]">
                  为每位家族成员建立详细档案，记录生平故事
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-[#e8e0d4] bg-white/80">
              <CardHeader className="pb-3">
                <Share2 className="mb-2 h-8 w-8 text-[#c8953f]" />
                <CardTitle className="text-lg text-[#5c4a32]">协作共建</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#8a7a65]">
                  邀请家族成员共同编辑，一人创建全家参与
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-[#e8e0d4] bg-white/80">
              <CardHeader className="pb-3">
                <BookOpen className="mb-2 h-8 w-8 text-[#c8953f]" />
                <CardTitle className="text-lg text-[#5c4a32]">永久保存</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#8a7a65]">
                  云端备份，数据导出，家族记忆永不丢失
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-white/50">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-[#5c4a32]">
            三步创建家族
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c8953f]/10 text-xl font-bold text-[#c8953f]">
                1
              </div>
              <h3 className="mb-2 font-semibold text-[#5c4a32]">创建家族</h3>
              <p className="text-sm text-[#8a7a65]">输入家族名称，选择祖籍，生成专属链接</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c8953f]/10 text-xl font-bold text-[#c8953f]">
                2
              </div>
              <h3 className="mb-2 font-semibold text-[#5c4a32]">添加成员</h3>
              <p className="text-sm text-[#8a7a65]">从祖辈开始，逐代添加家族成员信息</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c8953f]/10 text-xl font-bold text-[#c8953f]">
                3
              </div>
              <h3 className="mb-2 font-semibold text-[#5c4a32]">邀请协作</h3>
              <p className="text-sm text-[#8a7a65]">分享链接给亲属，共同完善家族记忆</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm text-[#8a7a65]">
        <p>家承 · 让每个家庭都值得被记住</p>
      </footer>
    </div>
  );
}
