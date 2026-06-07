-- 家承 MVP 数据库初始化（可重复执行版本）

-- 先删除可能已存在的旧表和对象
DROP TABLE IF EXISTS public.invitations CASCADE;
DROP TABLE IF EXISTS public.family_collaborators CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.families CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at();

-- 1. 家族表
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  origin TEXT,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise'))
);

CREATE INDEX idx_families_slug ON families(slug);

-- 2. 家族成员表
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender SMALLINT CHECK (gender IN (0, 1, 2)),
  birth_year INTEGER,
  death_year INTEGER,
  birth_date DATE,
  death_date DATE,
  birthplace TEXT,
  current_location TEXT,
  occupation TEXT,
  education TEXT,
  bio TEXT,
  stories TEXT,
  avatar_url TEXT,
  photos TEXT[],
  parent_id UUID REFERENCES members(id) ON DELETE SET NULL,
  spouse_id UUID REFERENCES members(id) ON DELETE SET NULL,
  order_in_siblings INTEGER DEFAULT 0,
  generation INTEGER DEFAULT 1,
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

-- 4. 用户资料扩展表
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
  code TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('viewer', 'editor')),
  expires_at TIMESTAMPTZ,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invitations_code ON invitations(code);

-- RLS
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "collaborators_select" ON family_collaborators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM families WHERE id = family_collaborators.family_id AND (
        admin_id = auth.uid() OR
        EXISTS (SELECT 1 FROM family_collaborators fc WHERE fc.family_id = families.id AND fc.user_id = auth.uid())
      )
    )
  );

CREATE POLICY "invitations_select" ON invitations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM families WHERE id = invitations.family_id AND admin_id = auth.uid()) OR
    code IN (SELECT code FROM invitations WHERE used_by = auth.uid())
  );

-- 触发器
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
