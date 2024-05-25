import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jhzybdvgkjufgaznvhgf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoenliZHZna2p1Zmdhem52aGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYxNjQ3MDIsImV4cCI6MjAzMTc0MDcwMn0.hp1WpuWV_fsCY0zxit23ZI4LOesLo-9aXSmWtfJ2afQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})