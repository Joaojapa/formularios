import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'SUA_SUPABASE_URL'
const supabaseKey = 'SUA_CHAVE_ANON'

export const supabase = createClient(supabaseUrl, supabaseKey)
