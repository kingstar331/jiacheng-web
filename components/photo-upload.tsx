"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";

interface PhotoUploadProps {
  familyId: string;
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
}

export function PhotoUpload({ familyId, onUploadComplete, maxFiles = 10 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; preview: string; caption: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, maxFiles - previews.length);
    
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, { file, preview: reader.result as string, caption: "" }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    setPreviews((prev) =>
      prev.map((p, i) => (i === index ? { ...p, caption } : p))
    );
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;
    setUploading(true);

    const uploadedUrls: string[] = [];

    // 模拟上传（实际应上传到 Supabase Storage）
    for (const preview of previews) {
      // 压缩图片
      const compressed = await compressImage(preview.preview, 1200, 0.8);
      
      // 这里应该上传到 Supabase Storage
      // const { data, error } = await supabase.storage
      //   .from("family-photos")
      //   .upload(`${familyId}/${Date.now()}_${preview.file.name}`, compressed);
      
      // 模拟成功
      uploadedUrls.push(compressed);
    }

    setUploading(false);
    setPreviews([]);
    onUploadComplete?.(uploadedUrls);
  };

  return (
    <div className="space-y-4">
      {/* 上传按钮 */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-[#e8e0d4] rounded-xl p-8 text-center cursor-pointer hover:border-[#c8953f] hover:bg-[#faf8f3] transition-colors"
      >
        <ImagePlus className="h-8 w-8 text-[#c8953f] mx-auto mb-2" />
        <p className="text-sm text-[#5c4a32] font-medium">点击上传老照片</p>
        <p className="text-xs text-[#8a7a65] mt-1">支持 JPG、PNG，最多 {maxFiles} 张</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* 预览列表 */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-[#5c4a32] font-medium">已选择 {previews.length} 张照片</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative rounded-lg border border-[#e8e0d4] overflow-hidden bg-white">
                <img
                  src={preview.preview}
                  alt={`预览 ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
                <input
                  type="text"
                  placeholder="添加照片说明..."
                  value={preview.caption}
                  onChange={(e) => updateCaption(index, e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border-t border-[#e8e0d4] focus:outline-none focus:ring-1 focus:ring-[#c8953f]"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-[#c8953f] hover:bg-[#b08435] text-white"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                确认上传
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// 图片压缩工具函数
async function compressImage(dataUrl: string, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
}
