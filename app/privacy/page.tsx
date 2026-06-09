import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Trash2, Download } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回首页
        </Link>

        <h1 className="text-3xl font-bold text-[#5c4a32] mb-2">隐私政策</h1>
        <p className="text-[#8a7a65] mb-8">最后更新：2024年</p>

        <div className="space-y-8">
          <section className="bg-white rounded-xl border border-[#e8e0d4] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#c8953f]/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-[#c8953f]" />
              </div>
              <h2 className="text-xl font-bold text-[#5c4a32]">数据归属权</h2>
            </div>
            <ul className="space-y-2 text-[#5c4a32]">
              <li>• 您创建的所有家族数据（成员信息、照片、故事）完全归您所有</li>
              <li>• 我们不会将您的数据用于任何商业目的</li>
              <li>• 不会向第三方出售或共享您的家族数据</li>
              <li>• 您可以随时导出或删除全部数据</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-[#e8e0d4] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#c8953f]/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-[#c8953f]" />
              </div>
              <h2 className="text-xl font-bold text-[#5c4a32]">数据安全</h2>
            </div>
            <ul className="space-y-2 text-[#5c4a32]">
              <li>• 所有数据传输使用 HTTPS 加密</li>
              <li>• 数据库访问受严格权限控制</li>
              <li>• 邀请码机制确保仅家族成员可访问</li>
              <li>• 建议定期导出备份到本地</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-[#e8e0d4] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#c8953f]/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-[#c8953f]" />
              </div>
              <h2 className="text-xl font-bold text-[#5c4a32]">访问控制</h2>
            </div>
            <ul className="space-y-2 text-[#5c4a32]">
              <li>• 家族数据默认仅对受邀成员可见</li>
              <li>• 家族创建者可管理成员权限</li>
              <li>• 可随时撤销某成员的访问权限</li>
              <li>• 支持设置家族为完全私密模式</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-[#e8e0d4] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#c8953f]/10 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-[#c8953f]" />
              </div>
              <h2 className="text-xl font-bold text-[#5c4a32]">数据删除</h2>
            </div>
            <ul className="space-y-2 text-[#5c4a32]">
              <li>• 您可以随时删除任何成员信息</li>
              <li>• 家族创建者可删除整个家族数据</li>
              <li>• 删除操作不可逆，请提前备份</li>
              <li>• 删除后数据不会保留在我们的服务器上</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-[#e8e0d4] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#c8953f]/10 flex items-center justify-center">
                <Download className="h-5 w-5 text-[#c8953f]" />
              </div>
              <h2 className="text-xl font-bold text-[#5c4a32]">数据可携带性</h2>
            </div>
            <ul className="space-y-2 text-[#5c4a32]">
              <li>• 支持导出为 JSON 格式（完整数据）</li>
              <li>• 支持导出为 CSV 格式（表格查看）</li>
              <li>• 导出数据可用于迁移到其他平台</li>
              <li>• 建议定期导出备份</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 p-4 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
          <p className="text-sm text-[#8a7a65]">
            <strong className="text-[#5c4a32]">联系方式：</strong>
            如有隐私相关问题，请联系 support@jiacheng.app
          </p>
        </div>
      </div>
    </div>
  );
}
