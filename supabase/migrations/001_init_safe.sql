-- 家承 MVP 数据库初始化
-- 执行方式：Supabase Dashboard → SQL Editor → New query → 粘贴执行

-- 1. 家族表
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,           -- 家族短链接，如 "jin-family"
  name TEXT NOT NULL,                   -- 家族名称，如 "金氏家族"
  description TEXT,                     -- 家族简介
  origin TEXT,                          -- 祖籍
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise'))
);

-- slug 索引
CREATE INDEX idx_families_slug ON families(slug);

-- 2. 家族成员表（族谱核心）
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                   -- 姓名
  gender SMALLINT CHECK (gender IN (0, 1, 2)), -- 0=未知, 1=男, 2=女
  birth_year INTEGER,                   -- 出生年份
  death_year INTEGER,                   -- 逝世年份（NULL=在世）
  birth_date DATE,                      -- 完整生日
  death_date DATE,                      -- 完整忌日
  birthplace TEXT,                      -- 出生地
  current_location TEXT,                -- 现居地
  occupation TEXT,                      -- 职业
  education TEXT,                       -- 学历
  bio TEXT,                             -- 生平简介
  stories TEXT,                         -- 故事/回忆录（JSON 数组）
  avatar_url TEXT,                      -- 头像 URL
  photos TEXT[],                        -- 照片数组
  parent_id UUID REFERENCES members(id) ON DELETE SET NULL,  -- 父亲/母亲ID
  spouse_id UUID REFERENCES members(id) ON DELETE SET NULL,  -- 配偶ID
  order_in_siblings INTEGER DEFAULT 0,  -- 兄弟姐妹中的排序
  generation INTEGER DEFAULT 1,         -- 代数（自动计算）
  is_living BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_members_family ON members(family_id);
CREATE INDEX idx_members_parent ON members(parent_id);
CREATE INDEX idx_members_spouse ON members(spouse_id);

-- 3. 家族协作者表
CREATE TABLE family_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'editor' CHECK (role IN ('viewer', 'editor', 'admin')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(family_id, user_id)
);

CREATE INDEX idx_collaborators_family ON family_collaborators(family_id);

-- 4. 用户资料扩展表（补充 auth.users）
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 邀请链接表
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,            -- 邀请码
  role TEXT DEFAULT 'editor' CHECK (role IN ('viewer', 'editor')),
  expires_at TIMESTAMPTZ,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invitations_code ON invitations(code);

-- ========================
-- RLS (行级安全策略)
-- ========================

ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- families: 管理员或协作者可见
CREATE POLICY "families_select" ON families
  FOR SELECT USING (
    admin_id = auth.uid() OR
    EXISTS (SELECT 1 FROM family_collaborators WHERE family_id = families.id AND user_id = auth.uid())
  );

CREATE POLICY "families_insert" ON families
  FOR INSERT WITH CHECK (admin_id = auth.uid());

CREATE POLICY "families_update" ON families
  FOR UPDATE USING (admin_id = auth.uid());

CREATE POLICY "families_delete" ON families
  FOR DELETE USING (admin_id = auth.uid());

-- members: 同家族可见
CREATE POLICY "members_select" ON members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM families WHERE id = members.family_id AND (
        admin_id = auth.uid() OR
        EXISTS (SELECT 1 FROM family_collaborators WHERE family_id = families.id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "members_insert" ON members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM families WHERE id = members.family_id AND (
        admin_id = auth.uid() OR
        EXISTS (SELECT 1 FROM family_collaborators WHERE family_id = families.id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "members_update" ON members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM families WHERE id = members.family_id AND (
        admin_id = auth.uid() OR
        EXISTS (SELECT 1 FROM family_collaborators WHERE family_id = families.id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "members_delete" ON members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM families WHERE id = members.family_id AND (
        admin_id = auth.uid() OR
        EXISTS (SELECT 1 FROM family_collaborators WHERE family_id = families.id AND user_id = auth.uid() AND role = 'admin')
      )
    )
  );

-- profiles: 自己可见/编辑
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- family_collaborators: 家族成员可见
CREATE POLICY "collaborators_select" ON family_collaborators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM families WHERE id = family_collaborators.family_id AND (
        admin_id = auth.uid() OR
        EXISTS (SELECT 1 FROM family_collaborators fc WHERE fc.family_id = families.id AND fc.user_id = auth.uid())
      )
    )
  );

-- invitations: 家族管理员可见
CREATE POLICY "invitations_select" ON invitations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM families WHERE id = invitations.family_id AND admin_id = auth.uid()) OR
    code IN (SELECT code FROM invitations WHERE used_by = auth.uid())
  );

-- ========================
-- 触发器：自动更新 updated_at
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER families_updated_at
  BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================
-- 触发器：新用户自动创建 profile
-- ========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
