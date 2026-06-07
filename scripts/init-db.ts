import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function initDb() {
  const sql = readFileSync(join(process.cwd(), 'supabase/migrations/001_init.sql'), 'utf-8')
  
  // 分割 SQL 语句并逐条执行
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)
  
  for (const statement of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
    if (error) {
      // 如果 exec_sql 函数不存在，尝试直接执行
      console.log('Note:', error.message)
      break
    }
  }
  
  console.log('Database initialization attempted')
}

initDb().catch(console.error)
