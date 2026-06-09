import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, CheckCircle, AlertCircle, MessageSquare, Smartphone, Globe, Mail } from "lucide-react";

export default function BetaPage() {
  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8953f] to-[#b08435] text-white mb-4">
            <TreePine className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#5c4a32]">家承内测版</h1>
          <p className="text-[#8a7a65] mt-1">欢迎参与内测，一起完善产品</p>
        </div>

        {/* 快速开始 */}
        <Card className="border-[#e8e0d4] bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#5c4a32]">快速开始</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#c8953f]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#c8953f]">1</span>
                </div>
                <div>
                  <p className="text-sm text-[#5c4a32]">
                    访问{" "}
                    <Link href="/" className="text-[#c8953f] hover:underline font-medium">
                      家承首页
                    </Link>
                  </p>
                  <p className="text-xs text-[#8a7a65]">点击"创建我的家族"或"查看示例"</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#c8953f]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#c8953f]">2</span>
                </div>
                <div>
                  <p className="text-sm text-[#5c4a32]">注册账号</p>
                  <p className="text-xs text-[#8a7a65]">使用邮箱注册，简单快捷</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#c8953f]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#c8953f]">3</span>
                </div>
                <div>
                  <p className="text-sm text-[#5c4a32]">一键导入金氏家族数据</p>
                  <p className="text-xs text-[#8a7a65]">内测期间提供完整示例数据</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#c8953f]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#c8953f]">4</span>
                </div>
                <div>
                  <p className="text-sm text-[#5c4a32]">邀请家人协作</p>
                  <p className="text-xs text-[#8a7a65]">生成邀请链接，分享给亲属</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e8e0d4]">
              <Link href="/onboarding">
                <Button className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white">
                  立即开始内测
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 测试重点 */}
        <Card className="border-[#e8e0d4] bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#c8953f]" />
              测试重点
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-[#5c4a32]">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                注册/登录流程是否顺畅
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                金氏家族数据导入是否完整
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                族谱显示是否正确（配偶、子女关系）
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                人物档案编辑是否方便
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                故事/回忆添加是否正常
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                邀请协作功能是否可用
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                手机端访问体验如何
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 已知问题 */}
        <Card className="border-[#e8e0d4] bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              已知问题
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-[#5c4a32]">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>中国大陆访问：</strong>
                  Vercel 域名在中国大陆部分地区可能加载缓慢或空白，建议使用手机流量测试
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>头像上传：</strong>
                  暂不支持上传照片，后续版本添加
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>数据导出：</strong>
                  功能开发中
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 反馈方式 */}
        <Card className="border-[#e8e0d4] bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#5c4a32] flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#c8953f]" />
              反馈方式
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
                <Smartphone className="h-5 w-5 text-[#c8953f]" />
                <div>
                  <p className="text-sm font-medium text-[#5c4a32]">飞书/微信</p>
                  <p className="text-xs text-[#8a7a65]">直接发送问题和建议截图</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
                <Globe className="h-5 w-5 text-[#c8953f]" />
                <div>
                  <p className="text-sm font-medium text-[#5c4a32]">GitHub Issues</p>
                  <p className="text-xs text-[#8a7a65]">
                    <a 
                      href="https://github.com/kingstar331/jiacheng-web/issues" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#c8953f] hover:underline"
                    >
                      github.com/kingstar331/jiacheng-web/issues
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
                <Mail className="h-5 w-5 text-[#c8953f]" />
                <div>
                  <p className="text-sm font-medium text-[#5c4a32]">邮件反馈</p>
                  <p className="text-xs text-[#8a7a65]">发送问题描述和截图</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 内测链接 */}
        <Card className="border-[#c8953f] bg-[#c8953f]/5">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-[#5c4a32] mb-2">金氏家族示例</p>
            <Link 
              href="/f/jin-family" 
              className="text-lg font-bold text-[#c8953f] hover:underline break-all"
            >
              https://jiacheng-web.vercel.app/f/jin-family
            </Link>
            <p className="text-xs text-[#8a7a65] mt-2">
              无需注册即可查看，注册后可编辑
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
