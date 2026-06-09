import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Users, BookOpen, Share2, Heart, MapPin, Clock, Shield, ArrowRight, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#faf8f3]/80 backdrop-blur-sm border-b border-[#e8e0d4]">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreePine className="h-6 w-6 text-[#c8953f]" />
            <span className="text-xl font-bold text-[#5c4a32]">家承</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm text-[#8a7a65] hover:text-[#c8953f] transition-colors">
              登录
            </Link>
            <Link href="/onboarding">
              <Button size="sm" className="bg-[#c8953f] hover:bg-[#b08435] text-white">
                创建家族
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#c8953f]/5" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-[#c8953f]/5" />
          <div className="absolute top-40 right-1/4 w-16 h-16 rounded-full bg-[#c8953f]/10" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full bg-[#c8953f]/10 px-4 py-1.5 text-sm font-medium text-[#c8953f]">
            <Star className="h-3 w-3 mr-1" />
            家族数字化传承平台
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-[#5c4a32] sm:text-6xl md:text-7xl">
            家承
          </h1>
          <p className="mb-4 text-2xl text-[#8a7a65] font-light">
            记录家族，传承记忆
          </p>
          <p className="mb-12 text-lg text-[#8a7a65]/80 max-w-xl mx-auto leading-relaxed">
            让每个家庭都有自己的数字族谱。从祖辈到孙辈，记录四代人的故事、迁徙与传承。
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="bg-[#c8953f] hover:bg-[#b08435] text-white px-8 text-base">
                创建我的家族
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10 px-8 text-base">
                查看示例家族
              </Button>
            </Link>
          </div>

          {/* 统计 */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#c8953f]">4</div>
              <div className="text-xs text-[#8a7a65] mt-1">代际记录</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#c8953f]">∞</div>
              <div className="text-xs text-[#8a7a65] mt-1">故事存储</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#c8953f]">100%</div>
              <div className="text-xs text-[#8a7a65] mt-1">免费使用</div>
            </div>
          </div>
        </div>
      </section>

      {/* 使用场景 */}
      <section className="px-6 py-20 bg-white/60">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#5c4a32]">
            为什么创建数字族谱？
          </h2>
          <p className="text-center text-[#8a7a65] mb-16 max-w-2xl mx-auto">
            每个家庭都有独特的故事，值得被记录和传承
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 border border-[#e8e0d4] hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#c8953f]/10 flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6 text-[#c8953f]" />
              </div>
              <h3 className="text-lg font-semibold text-[#5c4a32] mb-3">记录家族迁徙</h3>
              <p className="text-sm text-[#8a7a65] leading-relaxed">
                从祖辈的出生地到子孙的现居地，记录家族跨越时空的迁徙足迹。枣阳、棠棣、安陆、成都、深圳……每一座城市都是一段历史。
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 border border-[#e8e0d4] hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#c8953f]/10 flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-[#c8953f]" />
              </div>
              <h3 className="text-lg font-semibold text-[#5c4a32] mb-3">保存口述历史</h3>
              <p className="text-sm text-[#8a7a65] leading-relaxed">
                爷爷奶奶的抗战经历、父亲的创业故事、母亲的持家智慧……通过访谈记录，将珍贵的口述历史永久保存。
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 border border-[#e8e0d4] hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#c8953f]/10 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-[#c8953f]" />
              </div>
              <h3 className="text-lg font-semibold text-[#5c4a32] mb-3">连接散落亲人</h3>
              <p className="text-sm text-[#8a7a65] leading-relaxed">
                家族成员分散在不同城市甚至不同国家？一个在线族谱让所有人都能参与共建，维系血脉亲情。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#5c4a32]">
            核心功能
          </h2>
          <p className="text-center text-[#8a7a65] mb-16">
            为家族记忆传承打造的完整工具箱
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[#e8e0d4] bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <TreePine className="mb-3 h-8 w-8 text-[#c8953f]" />
                <CardTitle className="text-lg text-[#5c4a32]">可视化族谱</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#8a7a65] text-sm leading-relaxed">
                  拖拽式族谱编辑器，轻松构建四代家族树。支持配偶并排、子女分支展示。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-[#e8e0d4] bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <Users className="mb-3 h-8 w-8 text-[#c8953f]" />
                <CardTitle className="text-lg text-[#5c4a32]">人物档案</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#8a7a65] text-sm leading-relaxed">
                  为每位家族成员建立详细档案，记录生平、职业、学历、故事与回忆。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-[#e8e0d4] bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <Share2 className="mb-3 h-8 w-8 text-[#c8953f]" />
                <CardTitle className="text-lg text-[#5c4a32]">协作共建</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#8a7a65] text-sm leading-relaxed">
                  生成邀请链接，邀请家族成员共同编辑。一人创建，全家参与。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-[#e8e0d4] bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <Shield className="mb-3 h-8 w-8 text-[#c8953f]" />
                <CardTitle className="text-lg text-[#5c4a32]">数据安全</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#8a7a65] text-sm leading-relaxed">
                  云端备份 + 数据导出，家族记忆永不丢失。支持导出为多种格式永久保存。
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 家族迁徙示例 */}
      <section className="px-6 py-20 bg-white/60">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#5c4a32]">
            一条迁徙线，半部家族史
          </h2>
          <p className="text-center text-[#8a7a65] mb-12">
            从祖辈到孙辈，记录家族跨越时空的足迹
          </p>

          <div className="relative">
            {/* 迁徙路线 */}
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#c8953f]/20 -translate-y-1/2" />
              
              {[
                { city: "枣阳", year: "1931", desc: "祖辈起源" },
                { city: "棠棣", year: "1950s", desc: "扎根发展" },
                { city: "安陆", year: "1980s", desc: "进城奋斗" },
                { city: "成都", year: "2000s", desc: "开枝散叶" },
                { city: "深圳", year: "2010s", desc: "新时代" },
              ].map((item, index) => (
                <div key={index} className="relative flex flex-col items-center bg-[#faf8f3] px-2 z-10">
                  <div className="w-3 h-3 rounded-full bg-[#c8953f] mb-2" />
                  <span className="text-sm font-medium text-[#5c4a32]">{item.city}</span>
                  <span className="text-xs text-[#8a7a65]">{item.year}</span>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-[#8a7a65] mt-8 max-w-lg mx-auto">
              示例：金氏家族从湖北枣阳出发，历经四代人的迁徙，
              最终遍布成都、深圳等地。每个家族都有属于自己的独特轨迹。
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#5c4a32]">
            三步创建家族
          </h2>
          <p className="text-center text-[#8a7a65] mb-16">
            无需技术背景，几分钟即可开始
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "创建家族",
                desc: "输入家族名称，选择祖籍，生成专属家族空间",
                icon: TreePine,
              },
              {
                step: "2",
                title: "添加成员",
                desc: "从祖辈开始，逐代添加家族成员信息和照片",
                icon: Users,
              },
              {
                step: "3",
                title: "邀请协作",
                desc: "分享链接给亲属，共同完善家族记忆库",
                icon: Share2,
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c8953f]/10 text-[#c8953f]">
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#c8953f] text-white text-xs flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-[#5c4a32]">{item.title}</h3>
                <p className="text-sm text-[#8a7a65] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-[#c8953f]/5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#5c4a32]">
            开始记录您的家族
          </h2>
          <p className="text-[#8a7a65] mb-10 leading-relaxed">
            不要等到记忆模糊才开始。今天就开始创建您的家族族谱，<br />
            让子孙后代都能了解自己的根。
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="bg-[#c8953f] hover:bg-[#b08435] text-white px-10 text-base">
                免费创建家族
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-[#8a7a65]/60">
            完全免费 · 无需信用卡 · 数据可随时导出
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-[#5c4a32] text-white/80">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-3 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TreePine className="h-5 w-5 text-[#c8953f]" />
                <span className="text-lg font-bold text-white">家承</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                记录家族，传承记忆。<br />
                让每个家庭都值得被记住。
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">产品</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/onboarding" className="hover:text-[#c8953f] transition-colors">创建家族</Link></li>
                <li><Link href="/demo" className="hover:text-[#c8953f] transition-colors">查看示例</Link></li>
                <li><Link href="/auth/login" className="hover:text-[#c8953f] transition-colors">登录</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">关于</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><span className="hover:text-[#c8953f] transition-colors cursor-pointer">使用指南</span></li>
                <li><span className="hover:text-[#c8953f] transition-colors cursor-pointer">隐私政策</span></li>
                <li><span className="hover:text-[#c8953f] transition-colors cursor-pointer">联系我们</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-xs text-white/40">
            <p> 家承 JiāChéng. 保留所有权利。</p>
            <p className="mt-1">聚是一团火，散作满天星</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
