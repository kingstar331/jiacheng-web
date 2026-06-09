"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Member } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  User,
  Heart,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Baby,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FamilyTreeProps {
  members: Member[];
  familySlug: string;
  isAdmin?: boolean;
}

// 构建树形结构
function buildTree(members: Member[]) {
  const memberMap = new Map(members.map((m) => [m.id, { ...m, children: [] as Member[] }]));
  const roots: Member[] = [];

  members.forEach((member) => {
    const node = memberMap.get(member.id)!;
    if (member.parent_id && memberMap.has(member.parent_id)) {
      memberMap.get(member.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // 按 order_in_siblings 排序
  const sortChildren = (nodes: Member[]) => {
    nodes.sort((a, b) => (a.order_in_siblings || 0) - (b.order_in_siblings || 0));
    nodes.forEach((n) => {
      if (n.children?.length) sortChildren(n.children);
    });
  };
  sortChildren(roots);

  return roots;
}

// 计算代数
function calculateGeneration(member: Member, memberMap: Map<string, Member>, cache: Map<string, number> = new Map()): number {
  if (cache.has(member.id)) return cache.get(member.id)!;
  if (!member.parent_id) {
    cache.set(member.id, 1);
    return 1;
  }
  const parent = memberMap.get(member.parent_id);
  if (!parent) {
    cache.set(member.id, 1);
    return 1;
  }
  const gen = calculateGeneration(parent, memberMap, cache) + 1;
  cache.set(member.id, gen);
  return gen;
}

export function FamilyTreeEnhanced({ members, familySlug, isAdmin = false }: FamilyTreeProps) {
  const router = useRouter();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(members.map((m) => m.id)));
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // 触摸事件处理（移动端滑动）
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchPan, setTouchPan] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    setTouchPan({ x: dx, y: dy });
    setPan((prev) => ({
      x: prev.x + dx * 0.5,
      y: prev.y + dy * 0.5,
    }));
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchPan({ x: 0, y: 0 });
  };
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // 重新计算代数
  const memberMap = new Map(members.map((m) => [m.id, m]));
  const genCache = new Map<string, number>();
  const membersWithGen = members.map((m) => ({
    ...m,
    generation: calculateGeneration(m, memberMap, genCache),
  }));

  const treeRoots = buildTree(membersWithGen);

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedNodes(new Set(members.map((m) => m.id)));
  }, [members]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // 拖拽画布
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).closest(".tree-canvas")) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 查找配偶
  const getSpouse = (member: Member) => {
    if (!member.spouse_id) return null;
    return members.find((m) => m.id === member.spouse_id);
  };

  // 渲染节点卡片
  const renderNodeCard = (member: Member, showExpandButton = true) => {
    const spouse = getSpouse(member);
    const hasChildren = member.children && member.children.length > 0;
    const isExpanded = expandedNodes.has(member.id);

    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          {/* 主成员卡片 */}
          <div className="relative group">
            <Link
              href={`/f/${familySlug}/members/${member.id}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-[#e8e0d4] bg-white hover:border-[#c8953f] hover:shadow-lg transition-all min-w-[110px] relative"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c8953f]/20 to-[#c8953f]/5 flex items-center justify-center text-[#c8953f] overflow-hidden">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              <span className="text-sm font-semibold text-[#5c4a32]">{member.name}</span>
              {member.birth_year && (
                <span className="text-xs text-[#8a7a65]">{member.birth_year}年</span>
              )}
              {member.occupation && (
                <span className="text-xs text-[#8a7a65] truncate max-w-[100px]">{member.occupation}</span>
              )}
              {!member.is_living && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-full" title="已逝世" />
              )}
            </Link>

            {/* 添加子女按钮 */}
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/f/${familySlug}/members/new?parentId=${member.id}`);
                }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#c8953f] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-[#b08435]"
                title="添加子女"
              >
                <Plus className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* 配偶 */}
          {spouse && (
            <>
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-8 h-px bg-[#c8953f]" />
                <Heart className="h-3 w-3 text-[#c8953f] fill-[#c8953f]" />
                <div className="w-8 h-px bg-[#c8953f]" />
              </div>
              <Link
                href={`/f/${familySlug}/members/${spouse.id}`}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-[#e8e0d4] bg-white hover:border-[#c8953f] hover:shadow-lg transition-all min-w-[110px] relative"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c8953f]/20 to-[#c8953f]/5 flex items-center justify-center text-[#c8953f] overflow-hidden">
                  {spouse.avatar_url ? (
                    <img src={spouse.avatar_url} alt={spouse.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <span className="text-sm font-semibold text-[#5c4a32]">{spouse.name}</span>
                {spouse.birth_year && (
                  <span className="text-xs text-[#8a7a65]">{spouse.birth_year}年</span>
                )}
                {!spouse.is_living && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-full" title="已逝世" />
                )}
              </Link>
            </>
          )}
        </div>

        {/* 展开/收起按钮 */}
        {hasChildren && showExpandButton && (
          <button
            onClick={() => toggleNode(member.id)}
            className="mt-2 flex items-center gap-1 text-xs text-[#c8953f] hover:text-[#b08435] transition-colors px-2 py-1 rounded-full bg-[#c8953f]/10 hover:bg-[#c8953f]/20"
          >
            {isExpanded ? (
              <>
                <ChevronDown className="h-3 w-3" />
                <span>收起 ({member.children?.length || 0})</span>
              </>
            ) : (
              <>
                <ChevronRight className="h-3 w-3" />
                <span>展开 ({member.children?.length || 0})</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  // 递归渲染树
  const renderTree = (nodes: Member[], level = 0): React.ReactElement => {
    return (
      <div className={`flex gap-8 ${level > 0 ? "mt-6" : ""}`}>
        {nodes.map((node) => {
          const isExpanded = expandedNodes.has(node.id);
          const hasChildren = node.children && node.children.length > 0;

          return (
            <div key={node.id} className="flex flex-col items-center">
              {/* 连接线 - 从父节点下来 */}
              {level > 0 && (
                <div className="flex flex-col items-center mb-2">
                  <div className="w-px h-4 bg-[#c8953f]/40" />
                  <div className="w-2 h-2 rounded-full bg-[#c8953f]/60" />
                </div>
              )}

              {/* 节点卡片 */}
              {renderNodeCard(node)}

              {/* 子节点 */}
              {hasChildren && isExpanded && node.children && (
                <div className="mt-4 relative">
                  {/* 垂直连接线 */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-[#c8953f]/40" />
                  <div className="pt-4">
                    {renderTree(node.children, level + 1)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // 按代数分组（用于移动端）
  const byGeneration = membersWithGen.reduce((acc, m) => {
    const gen = m.generation || 1;
    if (!acc[gen]) acc[gen] = [];
    acc[gen].push(m);
    return acc;
  }, {} as Record<number, typeof membersWithGen>);

  const generations = Object.keys(byGeneration)
    .map(Number)
    .sort((a, b) => a - b);

  const [expandedGens, setExpandedGens] = useState<Set<number>>(new Set(generations));

  const toggleGen = (gen: number) => {
    setExpandedGens((prev) => {
      const next = new Set(prev);
      if (next.has(gen)) next.delete(gen);
      else next.add(gen);
      return next;
    });
  };

  return (
    <div className="rounded-xl bg-white border border-[#e8e0d4] overflow-hidden">
      {/* 头部工具栏 */}
      <div className="px-4 py-3 border-b border-[#e8e0d4] bg-[#faf8f3] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#c8953f]" />
          <h3 className="font-semibold text-[#5c4a32]">家族族谱</h3>
          <span className="text-xs text-[#8a7a65] bg-[#e8e0d4] px-2 py-0.5 rounded-full">
            {members.length}人
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/f/${familySlug}/members/new`)}
              className="h-8 text-xs border-[#c8953f] text-[#c8953f] hover:bg-[#c8953f]/10"
            >
              <Plus className="h-3 w-3 mr-1" />
              添加成员
            </Button>
          )}

          <div className="hidden md:flex items-center gap-1 ml-2">
            <Button variant="ghost" size="sm" onClick={expandAll} className="h-8 text-xs">
              全部展开
            </Button>
            <Button variant="ghost" size="sm" onClick={collapseAll} className="h-8 text-xs">
              全部收起
            </Button>
            <div className="w-px h-4 bg-[#e8e0d4] mx-1" />
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-[#8a7a65] w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleResetZoom} className="h-8 w-8" title="重置">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 桌面端：树状图 */}
      <div
        ref={containerRef}
        className="hidden md:block p-6 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: isFullscreen ? "calc(100vh - 200px)" : "600px" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="tree-canvas flex justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "top center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          {treeRoots.length > 0 ? (
            renderTree(treeRoots)
          ) : (
            <div className="flex flex-col items-center gap-4 py-12 text-[#8a7a65]">
              <Baby className="h-12 w-12 text-[#e8e0d4]" />
              <p>暂无成员，请先添加家族创始人</p>
              {isAdmin && (
                <Button
                  onClick={() => router.push(`/f/${familySlug}/members/new`)}
                  className="bg-[#c8953f] hover:bg-[#b08435] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加第一位成员
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 移动端：折叠列表 */}
      <div className="md:hidden">
        {generations.map((gen) => {
          const genMembers = byGeneration[gen];
          const isExpanded = expandedGens.has(gen);

          return (
            <div key={gen} className="border-b border-[#e8e0d4] last:border-0">
              <button
                onClick={() => toggleGen(gen)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#5c4a32]">第{gen}代</span>
                  <span className="text-xs text-[#8a7a65] bg-[#e8e0d4] px-2 py-0.5 rounded-full">
                    {genMembers.length}人
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-[#8a7a65]" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#8a7a65]" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 space-y-2">
                  {genMembers.map((member) => {
                    const spouse = getSpouse(member);
                    if (member.spouse_id && member.id > member.spouse_id) return null;

                    return (
                      <div key={member.id}>
                        <Link
                          href={`/f/${familySlug}/members/${member.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg border border-[#e8e0d4] bg-white hover:border-[#c8953f] transition-all"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8953f]/20 to-[#c8953f]/5 flex items-center justify-center text-[#c8953f] overflow-hidden flex-shrink-0">
                            {member.avatar_url ? (
                              <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-[#5c4a32]">{member.name}</span>
                              {spouse && (
                                <>
                                  <Heart className="h-3 w-3 text-[#c8953f] fill-[#c8953f]" />
                                  <span className="font-medium text-[#5c4a32]">{spouse.name}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#8a7a65]">
                              {member.birth_year && <span>{member.birth_year}年</span>}
                              {member.occupation && <span>· {member.occupation}</span>}
                              {!member.is_living && <span className="text-gray-400">· 已逝世</span>}
                            </div>
                          </div>
                          {member.children && member.children.length > 0 && (
                            <span className="text-xs text-[#c8953f] bg-[#c8953f]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                              {member.children.length}子女
                            </span>
                          )}
                        </Link>

                        {/* 移动端添加子女按钮 */}
                        {isAdmin && (
                          <button
                            onClick={() => router.push(`/f/${familySlug}/members/new?parentId=${member.id}`)}
                            className="mt-1 ml-12 flex items-center gap-1 text-xs text-[#c8953f] hover:text-[#b08435] transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                            添加子女
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {generations.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-12 text-[#8a7a65]">
            <Baby className="h-12 w-12 text-[#e8e0d4]" />
            <p>暂无成员</p>
            {isAdmin && (
              <Button
                onClick={() => router.push(`/f/${familySlug}/members/new`)}
                className="bg-[#c8953f] hover:bg-[#b08435] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加第一位成员
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
