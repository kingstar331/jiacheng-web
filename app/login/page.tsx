import { redirect } from "next/navigation";

export default function LoginRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 将 /login?redirect=xxx 重定向到 /auth/login?redirect=xxx
  const params = searchParams;
  const queryString = Object.entries(params)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value || "")}`;
    })
    .join("&");
  
  redirect(`/auth/login${queryString ? `?${queryString}` : ""}`);
}
