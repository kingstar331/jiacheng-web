# 家承 - 中国大陆访问优化指南

## 问题
Vercel 默认域名 `*.vercel.app` 在中国大陆部分地区访问不稳定，可能出现空白页或加载失败。

## 解决方案：自定义域名 + Cloudflare CDN

### 第一步：购买域名（需您操作）

推荐平台：
- **阿里云**（wanwang.aliyun.com）— .com 约 60元/年
- **腾讯云**（dnspod.cloud.tencent.com）— .cn 约 30元/年
- **Cloudflare**（cloudflare.com）— 注册免费

建议域名：`jiacheng.app` / `jiacheng.family` / `jiazupu.com`

> 注意：.cn 域名需要中国大陆实名认证

### 第二步：配置 Cloudflare（推荐）

1. 注册 Cloudflare 账号（免费）：https://dash.cloudflare.com
2. 添加您的域名
3. 修改域名 DNS 服务器为 Cloudflare 提供的地址
4. 等待 DNS 生效（通常几分钟到几小时）

### 第三步：添加 DNS 记录

在 Cloudflare 控制台添加以下记录：

| 类型 | 名称 | 内容 | 代理状态 |
|------|------|------|----------|
| CNAME | @ | cname.vercel-dns.com | 已代理（橙色云） |
| CNAME | www | cname.vercel-dns.com | 已代理（橙色云） |

### 第四步：Vercel 绑定域名

1. 打开 Vercel 项目：https://vercel.com/dashboard
2. 进入 `jiacheng-web` 项目 → Settings → Domains
3. 添加您的域名（如 `jiacheng.app`）
4. Vercel 会自动验证并颁发 SSL 证书

### 第五步：中国大陆优化（可选）

如果 Cloudflare 免费版仍不够快，可以：

1. **Cloudflare Pro**（$20/月）— 更好的全球节点
2. **阿里云 CDN** — 国内节点，需备案
3. **腾讯云 CDN** — 国内节点，需备案

> 注意：使用国内 CDN 需要域名 ICP 备案，流程约 1-2 周

### 备案说明（如需要国内 CDN）

1. 在阿里云/腾讯云购买服务器（最低配即可）
2. 提交 ICP 备案申请（提供身份证、域名证书等）
3. 等待管局审核（约 1-2 周）
4. 备案完成后可开通国内 CDN

### 快速验证

配置完成后，测试访问：
```bash
# 测试 DNS 解析
dig jiacheng.app

# 测试访问速度
curl -o /dev/null -s -w "%{time_total}\n" https://jiacheng.app
```

### 备选方案（不备案）

如果不想备案，可以：
1. 使用香港/新加坡服务器部署（已有）
2. 使用 Cloudflare 免费版（无需备案）
3. 使用 Vercel Edge Network（自动全球加速）

## 当前状态

- Vercel 部署：https://jiacheng-web.vercel.app
- 服务器部署：http://43.160.222.243（新加坡，国内访问尚可）
- 建议：先配置 Cloudflare + 自定义域名，如仍不满意再考虑备案
