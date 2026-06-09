"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, User } from "lucide-react";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  memberId: string;
  onUploadComplete: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, memberId, onUploadComplete }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 压缩图片
  async function compressImage(file: File, maxWidth = 400): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        // 计算缩放比例
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob failed"));
            }
          },
          "image/jpeg",
          0.8
        );

        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => reject(new Error("Image load failed"));
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件");
      return;
    }

    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert("图片大小不能超过 5MB");
      return;
    }

    setUploading(true);

    try {
      // 压缩图片
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], `${memberId}.jpg`, {
        type: "image/jpeg",
      });

      // 上传到 Supabase Storage
      const supabase = createClient();
      const filePath = `avatars/${memberId}/${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("family-photos")
        .upload(filePath, compressedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // 获取公开 URL
      const { data: { publicUrl } } = supabase.storage
        .from("family-photos")
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUploadComplete(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("上传失败，请重试");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreview(null);
    onUploadComplete("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-3"
    >
      {/* 预览区域 */}
      <div className="relative"
      >
        {preview ? (
          <div className="relative"
          >
            <img
              src={preview}
              alt="头像预览"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#e8e0d4]"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-[#c8953f]/10 flex items-center justify-center border-2 border-dashed border-[#e8e0d4]"
          >
            <User className="h-10 w-10 text-[#c8953f]" />
          </div>
        )}
      </div>

      {/* 上传按钮 */}
      <div className="flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={`avatar-upload-${memberId}`}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10"
        >
          <Upload className="h-4 w-4 mr-1" />
          {uploading ? "上传中..." : preview ? "更换头像" : "上传头像"}
        </Button>
      </div>

      <p className="text-xs text-[#8a7a65]"
      >
        支持 JPG、PNG，最大 5MB
      </p>
    </div>
  );
}
