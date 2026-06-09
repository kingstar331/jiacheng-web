"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, User, BookOpen, Plus, X } from "lucide-react";

interface TimelineEvent {
  id?: string;
  year: number;
  month?: number;
  day?: number;
  title: string;
  description: string;
  type: "birth" | "death" | "marriage" | "migration" | "career" | "history" | "other";
  location?: string;
  member_id?: string;
  member_name?: string;
}

const eventTypeConfig = {
  birth: { label: "出生", color: "#4ade80", icon: User, bgColor: "#f0fdf4" },
  death: { label: "逝世", color: "#9ca3af", icon: User, bgColor: "#f9fafb" },
  marriage: { label: "婚嫁", color: "#f472b6", icon: User, bgColor: "#fdf2f8" },
  migration: { label: "迁徙", color: "#60a5fa", icon: MapPin, bgColor: "#eff6ff" },
  career: { label: "事业", color: "#c8953f", icon: BookOpen, bgColor: "#faf8f3" },
  history: { label: "时代", color: "#a78bfa", icon: Calendar, bgColor: "#f5f3ff" },
  other: { label: "其他", color: "#8a7a65", icon: BookOpen, bgColor: "#faf8f3" },
};

export default function TimelinePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  // 表单状态
  const [form, setForm] = useState<Partial<TimelineEvent>>({
    year: new Date().getFullYear(),
    month: undefined,
    day: undefined,
    title: "",
    description: "",
    type: "other",
    location: "",
    member_id: "",
  });

  useEffect(() => {
    loadData();
  }, [slug]);

  async function loadData() {
    const supabase = createClient();

    // 加载家族
    const { data: familyData } = await supabase
      .from("families")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (familyData) {
      // 加载成员
      const { data: membersData } = await supabase
        .from("members")
        .select("id, name, birth_year, death_year, birth_date, death_date, birthplace, current_location, occupation, generation")
        .eq("family_id", familyData.id)
        .order("birth_year", { ascending: true });

      if (membersData) {
        setMembers(membersData);

        // 从成员数据自动生成时间轴事件
        const autoEvents: TimelineEvent[] = [];

        membersData.forEach((m) => {
          // 出生事件
          if (m.birth_year) {
            autoEvents.push({
              year: m.birth_year,
              month: m.birth_date ? parseInt(m.birth_date.split("-")[1]) : undefined,
              day: m.birth_date ? parseInt(m.birth_date.split("-")[2]) : undefined,
              title: `${m.name} 出生`,
              description: m.birthplace ? `出生于${m.birthplace}` : "",
              type: "birth",
              location: m.birthplace,
              member_id: m.id,
              member_name: m.name,
            });
          }

          // 逝世事件
          if (m.death_year) {
            autoEvents.push({
              year: m.death_year,
              month: m.death_date ? parseInt(m.death_date.split("-")[1]) : undefined,
              day: m.death_date ? parseInt(m.death_date.split("-")[2]) : undefined,
              title: `${m.name} 逝世`,
              description: "",
              type: "death",
              location: m.current_location,
              member_id: m.id,
              member_name: m.name,
            });
          }

          // 职业/事业事件（如果有职业信息）
          if (m.occupation) {
            autoEvents.push({
              year: m.birth_year ? m.birth_year + 20 : 1950, // 估算工作年龄
              title: `${m.name} - ${m.occupation}`,
              description: `从事${m.occupation}`,
              type: "career",
              member_id: m.id,
              member_name: m.name,
            });
          }
        });

        // 按年份排序
        autoEvents.sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          if (a.month && b.month) return a.month - b.month;
          return 0;
        });

        setEvents(autoEvents);
      }
    }

    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.year || !form.title) return;

    // 这里可以保存到数据库，目前先本地添加
    const newEvent: TimelineEvent = {
      year: form.year,
      month: form.month,
      day: form.day,
      title: form.title,
      description: form.description || "",
      type: form.type as TimelineEvent["type"],
      location: form.location,
      member_id: form.member_id || undefined,
      member_name: form.member_id ? members.find((m) => m.id === form.member_id)?.name : undefined,
    };

    if (editingEvent) {
      setEvents(events.map((ev) => (ev.id === editingEvent.id ? { ...newEvent, id: editingEvent.id } : ev)));
    } else {
      setEvents([...events, { ...newEvent, id: Date.now().toString() }].sort((a, b) => a.year - b.year));
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({
      year: new Date().getFullYear(),
      month: undefined,
      day: undefined,
      title: "",
      description: "",
      type: "other",
      location: "",
      member_id: "",
    });
    setShowAddForm(false);
    setEditingEvent(null);
  };

  const handleDelete = (eventId: string) => {
    if (!confirm("确定删除此事件？")) return;
    setEvents(events.filter((e) => e.id !== eventId));
  };

  // 按年代分组
  const groupedEvents = events.reduce((acc, event) => {
    const decade = Math.floor(event.year / 10) * 10;
    if (!acc[decade]) acc[decade] = [];
    acc[decade].push(event);
    return acc;
  }, {} as Record<number, TimelineEvent[]>);

  const decades = Object.keys(groupedEvents)
    .map(Number)
    .sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <div className="text-[#8a7a65]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <Link href={`/f/${slug}`} className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回家族
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#5c4a32]">家族时间轴</h1>
            <p className="text-sm text-[#8a7a65] mt-1">记录家族百年历程，见证时代变迁</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#c8953f] hover:bg-[#b08435] text-white"
          >
            {showAddForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {showAddForm ? "取消" : "添加事件"}
          </Button>
        </div>

        {/* 添加/编辑表单 */}
        {showAddForm && (
          <Card className="border-[#e8e0d4] bg-white mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#5c4a32]">年份 *</label>
                    <input
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                      className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#5c4a32]">月份</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={form.month || ""}
                      onChange={(e) => setForm({ ...form, month: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#5c4a32]">日期</label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={form.day || ""}
                      onChange={(e) => setForm({ ...form, day: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#5c4a32]">事件标题 *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                      placeholder="如：爷爷参军入伍"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#5c4a32]">事件类型</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as TimelineEvent["type"] })}
                      className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                    >
                      {Object.entries(eventTypeConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#5c4a32]">地点</label>
                    <input
                      type="text"
                      value={form.location || ""}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                      placeholder="如：枣阳、棠棣镇"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#5c4a32]">关联成员</label>
                    <select
                      value={form.member_id || ""}
                      onChange={(e) => setForm({ ...form, member_id: e.target.value || undefined })}
                      className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f]"
                    >
                      <option value="">不关联</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}（第{m.generation}代）
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5c4a32]">详细描述</label>
                  <textarea
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-md border border-[#e8e0d4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8953f] min-h-[80px] resize-none"
                    placeholder="记录事件的详细经过和背景..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-[#c8953f] hover:bg-[#b08435] text-white">
                    {editingEvent ? "保存修改" : "添加事件"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    取消
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* 时间轴展示 */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-12 w-12 text-[#e8e0d4] mx-auto mb-4" />
            <p className="text-[#8a7a65]">暂无时间轴事件</p>
            <p className="text-sm text-[#8a7a65] mt-1">点击上方按钮添加家族大事记</p>
          </div>
        ) : (
          <div className="relative">
            {/* 中心线 */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-[#e8e0d4] sm:-translate-x-px" />

            <div className="space-y-8">
              {decades.map((decade) => (
                <div key={decade}>
                  {/* 年代标记 */}
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-[#c8953f] sm:-translate-x-1.5" />
                    <span className="ml-10 sm:ml-0 px-4 py-1 rounded-full bg-[#c8953f]/10 text-[#c8953f] text-sm font-bold">
                      {decade}年代
                    </span>
                  </div>

                  {/* 事件列表 */}
                  <div className="space-y-4">
                    {groupedEvents[decade].map((event, index) => {
                      const config = eventTypeConfig[event.type];
                      const Icon = config.icon;
                      const isLeft = index % 2 === 0;

                      return (
                        <div
                          key={event.id || `${event.year}-${index}`}
                          className={`relative flex items-start ${
                            isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                          }`}
                        >
                          {/* 时间点 */}
                          <div className="absolute left-4 sm:left-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 sm:-translate-x-1.5 mt-2"
                            style={{ borderColor: config.color }}
                          />

                          {/* 内容卡片 */}
                          <div className={`ml-10 sm:ml-0 sm:w-[calc(50%-20px)] ${
                            isLeft ? "sm:mr-10 sm:text-right" : "sm:ml-10"
                          }`}>
                            <Card className="border-[#e8e0d4] hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className={`flex items-start gap-3 ${isLeft ? "sm:flex-row-reverse" : ""}`}>
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: config.bgColor }}
                                  >
                                    <Icon className="h-5 w-5" style={{ color: config.color }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-lg font-bold text-[#5c4a32]">
                                        {event.year}
                                        {event.month ? `-${String(event.month).padStart(2, "0")}` : ""}
                                        {event.day ? `-${String(event.day).padStart(2, "0")}` : ""}
                                      </span>
                                      <span
                                        className="px-2 py-0.5 rounded text-xs font-medium"
                                        style={{
                                          backgroundColor: config.bgColor,
                                          color: config.color,
                                        }}
                                      >
                                        {config.label}
                                      </span>
                                    </div>
                                    <h3 className="font-semibold text-[#5c4a32] mt-1">{event.title}</h3>
                                    {event.description && (
                                      <p className="text-sm text-[#8a7a65] mt-1">{event.description}</p>
                                    )}
                                    {event.location && (
                                      <div className={`flex items-center gap-1 mt-2 text-xs text-[#8a7a65] ${isLeft ? "sm:justify-end" : ""}`}>
                                        <MapPin className="h-3 w-3" />
                                        {event.location}
                                      </div>
                                    )}
                                    {event.member_name && (
                                      <div className={`flex items-center gap-1 mt-1 text-xs text-[#c8953f] ${isLeft ? "sm:justify-end" : ""}`}>
                                        <User className="h-3 w-3" />
                                        <Link href={`/f/${slug}/members/${event.member_id}`} className="hover:underline">
                                          {event.member_name}
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 时代背景提示 */}
        <div className="mt-12 p-4 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
          <h3 className="text-sm font-medium text-[#5c4a32] mb-2">💡 建议添加的时代背景事件</h3>
          <ul className="text-sm text-[#8a7a65] space-y-1">
            <li>• 1931年：爷爷出生（九一八事变）</li>
            <li>• 1950-1953年：抗美援朝战争</li>
            <li>• 1957年：父亲出生</li>
            <li>• 1978年：改革开放</li>
            <li>• 1983年：您出生</li>
            <li>• 1990年代：从枣阳到棠棣镇</li>
            <li>• 2000年代：到深圳、成都发展</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
