import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from '../components/Account'
import { View, Button } from 'react-native'
import { Session } from '@supabase/supabase-js'
import HomeScreen_login from '../components/HomeScreen_login'

export default function LoginScreen({ navigation }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      {session && session.user ? <HomeScreen_login key={session.user.id} session={session}/> : <Auth />}
    </View>
  )
  
  // return (
  //   <View>
  //     {session && session.user ? navigation.navigate("Home") : <Auth />}
  //   </View>
  // )
}