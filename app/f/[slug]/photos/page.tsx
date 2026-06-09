"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, User, X, ChevronLeft, ChevronRight } from "lucide-react";
import { PhotoUpload } from "@/components/photo-upload";
import { EmptyState } from "@/components/empty-state";

interface Photo {
  id: string;
  url: string;
  caption: string;
  year?: number;
  location?: string;
  member_id?: string;
  member_name?: string;
  uploaded_at: string;
}

export default function PhotosPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, [slug]);

  async function loadData() {
    const supabase = createClient();

    const { data: familyData } = await supabase
      .from("families")
      .select("id")
      .eq("slug", slug)
      .single();

    if (familyData) {
      // 加载成员
      const { data: membersData } = await supabase
        .from("members")
        .select("id, name")
        .eq("family_id", familyData.id);

      if (membersData) setMembers(membersData);

      // 加载照片（从成员 avatar_url 和 stories 中提取）
      const { data: membersWithPhotos } = await supabase
        .from("members")
        .select("id, name, avatar_url, stories")
        .eq("family_id", familyData.id)
        .not("avatar_url", "is", null);

      const extractedPhotos: Photo[] = [];

      membersWithPhotos?.forEach((m) => {
        if (m.avatar_url) {
          extractedPhotos.push({
            id: `avatar_${m.id}`,
            url: m.avatar_url,
            caption: `${m.name} 的头像`,
            member_id: m.id,
            member_name: m.name,
            uploaded_at: new Date().toISOString(),
          });
        }
      });

      setPhotos(extractedPhotos);
    }

    setLoading(false);
  }

  const handleUploadComplete = (urls: string[]) => {
    // 添加新上传的照片
    const newPhotos = urls.map((url, index) => ({
      id: `new_${Date.now()}_${index}`,
      url,
      caption: "新上传的照片",
      uploaded_at: new Date().toISOString(),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    setShowUpload(false);
  };

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setLightboxIndex(index);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" ? lightboxIndex - 1 : lightboxIndex + 1;
    if (newIndex >= 0 && newIndex < photos.length) {
      setLightboxIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <div className="text-[#8a7a65]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-5xl">
        <Link href={`/f/${slug}`} className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回家族
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#5c4a32]">家族相册</h1>
            <p className="text-sm text-[#8a7a65] mt-1">收藏老照片，留住家族记忆</p>
          </div>
          <Button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-[#c8953f] hover:bg-[#b08435] text-white"
          >
            {showUpload ? "取消" : "上传照片"}
          </Button>
        </div>

        {/* 上传区域 */}
        {showUpload && (
          <Card className="border-[#e8e0d4] bg-white mb-8">
            <CardContent className="p-6">
              <PhotoUpload familyId={slug} onUploadComplete={handleUploadComplete} maxFiles={10} />
            </CardContent>
          </Card>
        )}

        {/* 照片网格 */}
        {photos.length === 0 ? (
          <EmptyState type="photos" familySlug={slug} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative rounded-xl border border-[#e8e0d4] overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-all"
                onClick={() => openLightbox(photo, index)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-[#5c4a32] truncate">{photo.caption}</p>
                  {photo.member_name && (
                    <div className="flex items-center gap-1 mt-1">
                      <User className="h-3 w-3 text-[#c8953f]" />
                      <span className="text-xs text-[#8a7a65]">{photo.member_name}</span>
                    </div>
                  )}
                  {photo.year && (
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-[#8a7a65]" />
                      <span className="text-xs text-[#8a7a65]">{photo.year}年</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 照片统计 */}
        {photos.length > 0 && (
          <div className="mt-8 p-4 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8a7a65]">共 {photos.length} 张照片</span>
              <span className="text-sm text-[#8a7a65]">涉及 {new Set(photos.map((p) => p.member_id).filter(Boolean)).size} 位成员</span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox 查看器 */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="h-6 w-6" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
            disabled={lightboxIndex === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
            disabled={lightboxIndex === photos.length - 1}
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="max-w-4xl max-h-[80vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-medium">{selectedPhoto.caption}</p>
              <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/70">
                {selectedPhoto.member_name && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" /> {selectedPhoto.member_name}
                  </span>
                )}
                {selectedPhoto.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {selectedPhoto.year}年
                  </span>
                )}
                {selectedPhoto.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {selectedPhoto.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
