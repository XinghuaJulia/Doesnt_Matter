import { useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from './Account'
import { View, Button } from 'react-native'
import { Session } from '@supabase/supabase-js'
import HomeScreen_login from '../components/HomeScreen_login'

import Tabs from '../components/Tabs'

import UserProfile from '../components/unused/UserProfile'

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
    session && session.user ? <Tabs session={session}/> : <Auth />
  )
}