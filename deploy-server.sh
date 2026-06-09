#!/bin/bash
# 家承 - 服务器部署脚本（中国大陆访问备选方案）

set -e

echo "=== 家承服务器部署 ==="

# 检查环境
if ! command -v node &> /dev/null; then
    echo "错误：未安装 Node.js"
    exit 1
fi

# 安装依赖
echo "[1/4] 安装依赖..."
npm install --production

# 构建
echo "[2/4] 构建应用..."
npm run build

# 检查构建结果
if [ ! -d ".next/standalone" ]; then
    echo "错误：构建失败，未生成 standalone 目录"
    exit 1
fi

# 复制静态资源
echo "[3/4] 复制静态资源..."
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/ 2>/dev/null || true

# 启动（使用 PM2）
echo "[4/4] 启动服务..."
if command -v pm2 &> /dev/null; then
    pm2 delete jiacheng-web 2>/dev/null || true
    pm2 start .next/standalone/server.js --name jiacheng-web
    pm2 save
    echo "✅ 已使用 PM2 启动"
else
    echo "⚠️ 未安装 PM2，使用 nohup 启动"
    nohup node .next/standalone/server.js > server.log 2>&1 &
    echo $! > server.pid
fi

echo ""
echo "=== 部署完成 ==="
echo "访问地址：http://$(curl -s ifconfig.me):3000"
echo ""
echo "如需停止服务："
echo "  PM2: pm2 stop jiacheng-web"
echo "  nohup: kill $(cat server.pid)"
