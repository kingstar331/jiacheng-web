#!/bin/bash
# 家承 - 一键部署脚本
# 用法: ./deploy.sh

set -e

echo "🚀 家承自部署脚本"
echo "=================="

# 检查环境
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    echo "   curl -fsSL https://get.docker.com | sh"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装"
    echo "   pip3 install docker-compose"
    exit 1
fi

# 检查环境变量
if [ ! -f .env.local ]; then
    echo "❌ .env.local 文件不存在"
    echo "   请创建 .env.local 文件，包含以下变量："
    echo "   NEXT_PUBLIC_SUPABASE_URL=..."
    echo "   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=..."
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
    exit 1
fi

echo "✓ 环境检查通过"
echo ""

# 拉取最新代码（可选）
if [ -d .git ]; then
    echo "📦 拉取最新代码..."
    git pull origin main
fi

# 构建并启动
echo "🔨 构建 Docker 镜像..."
docker-compose build --no-cache

echo "🚀 启动服务..."
docker-compose up -d

echo ""
echo "✅ 部署完成！"
echo ""
echo "访问地址:"
echo "  - 直接访问: http://$(curl -s ifconfig.me || echo '你的服务器IP'):3000"
echo "  - Nginx代理: http://$(curl -s ifconfig.me || echo '你的服务器IP')"
echo ""
echo "查看日志: docker-compose logs -f jiacheng"
echo "停止服务: docker-compose down"
echo "重启服务: docker-compose restart"
