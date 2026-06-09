import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, TreePine, BookOpen, ImageIcon, Plus } from "lucide-react";

interface EmptyStateProps {
  type: "members" | "stories" | "photos" | "timeline" | "family";
  familySlug?: string;
  memberId?: string;
}

export function EmptyState({ type, familySlug, memberId }: EmptyStateProps) {
  const configs = {
    members: {
      icon: User,
      title: "还没有成员",
      description: "从添加第一位家族成员开始，构建您的数字族谱",
      action: familySlug ? (
        <Link href={`/f/${familySlug}/members/new`}>
          <Button className="bg-[#c8953f] hover:bg-[#b08435] text-white">
            <Plus className="mr-1 h-4 w-4" />
            添加第一位成员
          </Button>
        </Link>
      ) : null,
    },
    stories: {
      icon: BookOpen,
      title: "还没有故事",
      description: "每个人的一生都有值得记录的故事",
      action: familySlug && memberId ? (
        <Link href={`/f/${familySlug}/members/${memberId}/edit`}>
          <Button variant="outline" className="border-[#c8953f] text-[#c8953f]">
            <Plus className="mr-1 h-4 w-4" />
            添加故事
          </Button>
        </Link>
      ) : null,
    },
    photos: {
      icon: ImageIcon,
      title: "还没有照片",
      description: "老照片是家族记忆最珍贵的载体",
      action: familySlug ? (
        <Link href={`/f/${familySlug}/photos`}>
          <Button variant="outline" className="border-[#c8953f] text-[#c8953f]">
            <Plus className="mr-1 h-4 w-4" />
            上传照片
          </Button>
        </Link>
      ) : null,
    },
    timeline: {
      icon: TreePine,
      title: "还没有时间轴事件",
      description: "记录家族大事记，见证时代变迁",
      action: familySlug ? (
        <Link href={`/f/${familySlug}/timeline`}>
          <Button variant="outline" className="border-[#c8953f] text-[#c8953f]">
            <Plus className="mr-1 h-4 w-4" />
            添加事件
          </Button>
        </Link>
      ) : null,
    },
    family: {
      icon: TreePine,
      title: "欢迎来到家承",
      description: "创建您的第一个家族，开始记录家族历史",
      action: (
        <Link href="/onboarding">
          <Button className="bg-[#c8953f] hover:bg-[#b08435] text-white">
            <Plus className="mr-1 h-4 w-4" />
            创建家族
          </Button>
        </Link>
      ),
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-[#c8953f]/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-[#c8953f]" />
      </div>
      <h3 className="text-lg font-semibold text-[#5c4a32] mb-2">{config.title}</h3>
      <p className="text-sm text-[#8a7a65] mb-6 max-w-sm mx-auto">{config.description}</p>
      {config.action}
    </div>
  );
}
