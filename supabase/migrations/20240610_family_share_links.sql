-- 家族分享链接表（家属免登录访问）
CREATE TABLE IF NOT EXISTS family_share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_count INTEGER DEFAULT 0
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_family_share_links_token ON family_share_links(token);
CREATE INDEX IF NOT EXISTS idx_family_share_links_family ON family_share_links(family_id);

-- RLS 策略
ALTER TABLE family_share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow family admins to manage share links"
  ON family_share_links
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM families
      WHERE families.id = family_share_links.family_id
      AND families.admin_id = auth.uid()
    )
  );
