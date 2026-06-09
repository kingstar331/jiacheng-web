"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Users, Navigation, Info } from "lucide-react";

// 家族迁徙路线数据（金氏家族）
const migrationRoute = [
  {
    id: "zaoyang",
    name: "枣阳",
    province: "湖北",
    coordinates: [112.77, 32.13] as [number, number],
    year: 1931,
    description: "家族起源地，爷爷金如香出生于此",
    events: ["爷爷金如香出生（1931年）", "参加抗美援朝战争（1950-1953）"],
    generation: 1,
  },
  {
    id: "tangdi",
    name: "棠棣镇",
    province: "湖北安陆",
    coordinates: [113.69, 31.26] as [number, number],
    year: 1957,
    description: "父亲金道武出生于此，经营粮食收购生意",
    events: ["父亲金道武出生（1957年）", "经营粮食收购生意", "金星、金亮成长于此"],
    generation: 2,
  },
  {
    id: "anlu",
    name: "安陆市",
    province: "湖北",
    coordinates: [113.69, 31.26] as [number, number], // 与棠棣镇相近，微调
    year: 1990,
    description: "从棠棣镇迁至安陆市区",
    events: ["家族迁至安陆市区", "生活条件改善"],
    generation: 2,
  },
  {
    id: "chengdu",
    name: "成都",
    province: "四川",
    coordinates: [104.07, 30.67] as [number, number],
    year: 2005,
    description: "金亮迁至成都发展",
    events: ["金亮到成都发展", "金丽一家定居成都"],
    generation: 3,
  },
  {
    id: "shenzhen",
    name: "深圳",
    province: "广东",
    coordinates: [114.06, 22.54] as [number, number],
    year: 2010,
    description: "金星迁至深圳，谢忻然、谢芮安出生于此",
    events: ["金星到深圳发展", "谢忻然出生（2013年）", "谢芮安出生（2015年）"],
    generation: 3,
  },
];

// 动态导入 Leaflet（避免 SSR 问题）
let L: any = null;

export default function MapPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<typeof migrationRoute[0] | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    initMap();
  }, [slug]);

  async function loadData() {
    const supabase = createClient();
    const { data: familyData } = await supabase
      .from("families")
      .select("id")
      .eq("slug", slug)
      .single();

    if (familyData) {
      const { data: membersData } = await supabase
        .from("members")
        .select("id, name, current_location, generation")
        .eq("family_id", familyData.id);

      if (membersData) setMembers(membersData);
    }
    setLoading(false);
  }

  async function initMap() {
    if (typeof window === "undefined") return;

    // 动态导入 Leaflet
    const leaflet = await import("leaflet");
    L = leaflet.default || leaflet;

    // 导入 CSS
    await import("leaflet/dist/leaflet.css");

    // 修复默认图标问题
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    // 创建地图
    const map = L.map("migration-map").setView([30, 110], 5);

    // 添加地图瓦片（使用高德地图瓦片）
    L.tileLayer("https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
      subdomains: "1234",
      attribution: "© 高德地图",
    }).addTo(map);

    // 绘制迁徙路线
    const routeCoordinates = migrationRoute.map((loc) => loc.coordinates);
    const polyline = L.polyline(routeCoordinates, {
      color: "#c8953f",
      weight: 3,
      opacity: 0.8,
      dashArray: "10, 10",
    }).addTo(map);

    // 添加动画效果
    const animatedLine = L.polyline(routeCoordinates, {
      color: "#c8953f",
      weight: 4,
      opacity: 1,
      dashArray: "20, 20",
      dashOffset: "0",
    }).addTo(map);

    // 添加地点标记
    migrationRoute.forEach((location, index) => {
      const marker = L.marker(location.coordinates).addTo(map);

      // 自定义弹出内容
      const popupContent = `
        <div style="font-family: system-ui; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #5c4a32; font-size: 16px; font-weight: bold;">
            ${location.name}
          </h3>
          <p style="margin: 0 0 4px 0; color: #8a7a65; font-size: 12px;">
            ${location.year}年 · 第${location.generation}代
          </p>
          <p style="margin: 0; color: #5c4a32; font-size: 13px;">
            ${location.description}
          </p>
        </div>
      `;

      marker.bindPopup(popupContent);

      // 点击事件
      marker.on("click", () => {
        setSelectedLocation(location);
      });

      // 添加序号标签
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          background: #c8953f;
          color: white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">${index + 1}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      marker.setIcon(icon);
    });

    // 适应地图到路线范围
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    setMapLoaded(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <div className="text-[#8a7a65]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <header className="border-b border-[#e8e0d4] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href={`/f/${slug}`} className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f]">
              <ArrowLeft className="mr-1 h-4 w-4" />
              返回家族
            </Link>
          </div>
          <h1 className="text-lg font-semibold text-[#5c4a32]">家族迁徙地图</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)]">
        {/* 地图区域 */}
        <div className="flex-1 relative">
          <div id="migration-map" className="w-full h-full min-h-[400px]" />
          
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#faf8f3]">
              <div className="text-[#8a7a65]">地图加载中...</div>
            </div>
          )}

          {/* 图例 */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg border border-[#e8e0d4] p-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-[#5c4a32]">
              <div className="w-8 h-0.5 bg-[#c8953f] border-dashed" style={{ borderTop: "2px dashed #c8953f" }} />
              <span>迁徙路线</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#5c4a32] mt-2">
              <div className="w-4 h-4 rounded-full bg-[#c8953f] border-2 border-white shadow" />
              <span>定居地点</span>
            </div>
          </div>
        </div>

        {/* 侧边栏 - 地点详情 */}
        <div className="w-full lg:w-96 bg-white border-l border-[#e8e0d4] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#5c4a32] mb-2">迁徙历程</h2>
            <p className="text-sm text-[#8a7a65] mb-6">
              从枣阳到深圳，跨越四代人的足迹
            </p>

            {/* 路线列表 */}
            <div className="space-y-4">
              {migrationRoute.map((location, index) => (
                <div
                  key={location.id}
                  className={`relative pl-8 pb-4 cursor-pointer transition-all ${
                    selectedLocation?.id === location.id
                      ? "bg-[#faf8f3] -mx-4 px-4 py-3 rounded-xl"
                      : "hover:bg-[#faf8f3]/50 -mx-4 px-4 py-3 rounded-xl"
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  {/* 时间线 */}
                  <div className="absolute left-4 top-3 bottom-0 w-0.5 bg-[#e8e0d4]" />
                  <div
                    className="absolute left-2 top-3 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: "#c8953f" }}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#5c4a32]">{location.name}</h3>
                      <span className="text-xs text-[#8a7a65]">{location.province}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-[#c8953f]">
                      <Calendar className="h-3 w-3" />
                      {location.year}年
                    </div>
                    <p className="text-sm text-[#5c4a32] mt-2">{location.description}</p>

                    {/* 事件列表 */}
                    <div className="mt-2 space-y-1">
                      {location.events.map((event, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-[#8a7a65]">
                          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          {event}
                        </div>
                      ))}
                    </div>

                    {/* 当前在此地的成员 */}
                    {members.filter((m) => m.current_location?.includes(location.name)).length > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-[#c8953f]">
                        <Users className="h-3 w-3" />
                        {members
                          .filter((m) => m.current_location?.includes(location.name))
                          .map((m) => m.name)
                          .join("、")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 统计 */}
            <div className="mt-6 pt-6 border-t border-[#e8e0d4]">
              <h3 className="text-sm font-semibold text-[#5c4a32] mb-3">迁徙统计</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#faf8f3] text-center">
                  <div className="text-2xl font-bold text-[#c8953f]">{migrationRoute.length}</div>
                  <div className="text-xs text-[#8a7a65]">途经城市</div>
                </div>
                <div className="p-3 rounded-lg bg-[#faf8f3] text-center">
                  <div className="text-2xl font-bold text-[#c8953f]">
                    {migrationRoute[migrationRoute.length - 1].year - migrationRoute[0].year}
                  </div>
                  <div className="text-xs text-[#8a7a65]">跨越年份</div>
                </div>
                <div className="p-3 rounded-lg bg-[#faf8f3] text-center">
                  <div className="text-2xl font-bold text-[#c8953f]">3</div>
                  <div className="text-xs text-[#8a7a65]">省份</div>
                </div>
                <div className="p-3 rounded-lg bg-[#faf8f3] text-center">
                  <div className="text-2xl font-bold text-[#c8953f]">4</div>
                  <div className="text-xs text-[#8a7a65]">代数</div>
                </div>
              </div>
            </div>

            {/* 迁徙意义 */}
            <div className="mt-6 p-4 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
              <h3 className="text-sm font-semibold text-[#5c4a32] mb-2 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-[#c8953f]" />
                迁徙意义
              </h3>
              <p className="text-sm text-[#5c4a32] leading-relaxed">
                从湖北枣阳到四川成都、广东深圳，金氏家族的迁徙轨迹映射了中国城镇化进程中普通家庭的缩影。
                从农村到城市，从内地到沿海，每一代人的选择都承载着对更好生活的向往。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
