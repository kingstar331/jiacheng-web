"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Cake,
  Heart,
  Clock,
  AlertCircle,
  Bell,
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  gender: number;
  birth_year?: number;
  birth_date?: string;
  death_year?: number;
  death_date?: string;
  generation: number;
  is_living: boolean;
}

interface Reminder {
  type: "birthday" | "death" | "milestone";
  member: Member;
  date: Date;
  label: string;
  daysUntil: number;
}

export default function RemindersPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [members, setMembers] = useState<Member[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [slug]);

  useEffect(() => {
    if (members.length > 0) {
      generateReminders();
    }
  }, [members]);

  async function loadData() {
    const supabase = createClient();
    const { data: familyData } = await supabase
      .from("families")
      .select("id")
      .eq("slug", slug)
      .single();

    if (familyData) {
      const { data } = await supabase
        .from("members")
        .select("id, name, gender, birth_year, birth_date, death_year, death_date, generation, is_living")
        .eq("family_id", familyData.id);

      if (data) setMembers(data);
    }
    setLoading(false);
  }

  function generateReminders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const newReminders: Reminder[] = [];

    members.forEach((member) => {
      // 生日提醒（仅在世成员）
      if (member.is_living && member.birth_date) {
        const birthDate = new Date(member.birth_date);
        const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

        // 如果今年生日已过，算明年的
        if (thisYearBirthday < today) {
          thisYearBirthday.setFullYear(currentYear + 1);
        }

        const daysUntil = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const age = thisYearBirthday.getFullYear() - birthDate.getFullYear();

        newReminders.push({
          type: "birthday",
          member,
          date: thisYearBirthday,
          label: `${age}岁生日`,
          daysUntil,
        });
      }

      // 诞辰提醒（已逝世成员）
      if (!member.is_living && member.birth_date) {
        const birthDate = new Date(member.birth_date);
        const thisYearMemorial = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

        if (thisYearMemorial < today) {
          thisYearMemorial.setFullYear(currentYear + 1);
        }

        const daysUntil = Math.ceil((thisYearMemorial.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        newReminders.push({
          type: "milestone",
          member,
          date: thisYearMemorial,
          label: "诞辰纪念",
          daysUntil,
        });
      }

      // 忌日提醒
      if (!member.is_living && member.death_date) {
        const deathDate = new Date(member.death_date);
        const thisYearDeath = new Date(currentYear, deathDate.getMonth(), deathDate.getDate());

        if (thisYearDeath < today) {
          thisYearDeath.setFullYear(currentYear + 1);
        }

        const daysUntil = Math.ceil((thisYearDeath.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        newReminders.push({
          type: "death",
          member,
          date: thisYearDeath,
          label: "忌日",
          daysUntil,
        });
      }
    });

    // 按天数排序
    newReminders.sort((a, b) => a.daysUntil - b.daysUntil);
    setReminders(newReminders);
  }

  const upcomingReminders = reminders.filter((r) => r.daysUntil <= 30);
  const laterReminders = reminders.filter((r) => r.daysUntil > 30);

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "birthday":
        return {
          icon: Cake,
          color: "text-pink-600",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-200",
        };
      case "death":
        return {
          icon: Heart,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
      case "milestone":
        return {
          icon: Bell,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        };
      default:
        return {
          icon: Calendar,
          color: "text-[#c8953f]",
          bgColor: "bg-[#faf8f3]",
          borderColor: "border-[#e8e0d4]",
        };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
    });
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
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/f/${slug}`}
          className="inline-flex items-center text-sm text-[#8a7a65] hover:text-[#c8953f] mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回家族
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#5c4a32]">纪念日提醒</h1>
            <p className="text-sm text-[#8a7a65] mt-1">
              记录重要日子，不忘家族温情
            </p>
          </div>
        </div>

        {/* 近期提醒 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#5c4a32] mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#c8953f]" />
            未来30天
            <span className="text-sm font-normal text-[#8a7a65]">
              ({upcomingReminders.length}个)
            </span>
          </h2>

          {upcomingReminders.length === 0 ? (
            <Card className="border-[#e8e0d4] bg-white">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-[#e8e0d4] mx-auto mb-4" />
                <p className="text-[#8a7a65]">近期没有纪念日</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map((reminder, index) => {
                const config = getTypeConfig(reminder.type);
                const Icon = config.icon;

                return (
                  <Card
                    key={`${reminder.member.id}-${reminder.type}-${index}`}
                    className={`border ${config.borderColor} bg-white hover:shadow-md transition-shadow`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className={`h-6 w-6 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#5c4a32]">
                              {reminder.member.name}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}
                            >
                              {reminder.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-[#8a7a65]">
                            <span>{formatDate(reminder.date)}</span>
                            <span>·</span>
                            <span
                              className={
                                reminder.daysUntil === 0
                                  ? "text-red-500 font-medium"
                                  : reminder.daysUntil <= 7
                                  ? "text-[#c8953f] font-medium"
                                  : ""
                              }
                            >
                              {reminder.daysUntil === 0
                                ? "今天"
                                : reminder.daysUntil === 1
                                ? "明天"
                                : `${reminder.daysUntil}天后`}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-[#c8953f]">
                            {reminder.daysUntil === 0 ? "🎉" : reminder.daysUntil}
                          </span>
                          {reminder.daysUntil > 0 && (
                            <p className="text-xs text-[#8a7a65]">天后</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* 更多提醒 */}
        {laterReminders.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-[#5c4a32] mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#c8953f]" />
              更多纪念日
            </h2>
            <div className="space-y-2">
              {laterReminders.slice(0, 20).map((reminder, index) => {
                const config = getTypeConfig(reminder.type);
                const Icon = config.icon;

                return (
                  <div
                    key={`later-${reminder.member.id}-${reminder.type}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#e8e0d4]"
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <span className="text-sm text-[#5c4a32]">
                      {reminder.member.name}
                    </span>
                    <span className="text-xs text-[#8a7a65]">
                      {reminder.label}
                    </span>
                    <span className="text-xs text-[#8a7a65] ml-auto">
                      {formatDate(reminder.date)} · {reminder.daysUntil}天后
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 提示 */}
        <div className="mt-8 p-4 rounded-lg bg-[#faf8f3] border border-[#e8e0d4]">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#c8953f] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#5c4a32] font-medium">
                如何添加纪念日？
              </p>
              <p className="text-sm text-[#8a7a65] mt-1">
                在成员档案中填写完整的出生日期和逝世日期，系统会自动生成生日、诞辰和忌日提醒。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
