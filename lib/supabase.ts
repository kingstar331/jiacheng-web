// 数据库类型定义
export type Family = {
  id: string
  slug: string
  name: string
  description: string | null
  origin: string | null
  admin_id: string
  created_at: string
  plan: string
}

export type Member = {
  id: string
  family_id: string
  name: string
  gender: number | null
  birth_year: number | null
  death_year: number | null
  birth_date: string | null
  death_date: string | null
  birthplace: string | null
  current_location: string | null
  occupation: string | null
  education: string | null
  bio: string | null
  stories: string | null
  avatar_url: string | null
  photos: string[] | null
  parent_id: string | null
  spouse_id: string | null
  order_in_siblings: number
  generation: number
  is_living: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  name: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
}

export type FamilyCollaborator = {
  id: string
  family_id: string
  user_id: string
  role: 'viewer' | 'editor' | 'admin'
  invited_by: string | null
  invited_at: string
}

export type Invitation = {
  id: string
  family_id: string
  code: string
  role: 'viewer' | 'editor'
  expires_at: string | null
  used_by: string | null
  used_at: string | null
  created_by: string
  created_at: string
}
