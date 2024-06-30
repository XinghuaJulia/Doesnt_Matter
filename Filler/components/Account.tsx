import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Text, ScrollView } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import Avatar from './Avatar'
import { daysAgo, pointsThisWeek, pointsToday } from './utils/helper'

import { COLORS } from '../constants/theme'


export default function Account({ route }) {
  const { session } : { session: Session } = route.params


  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [users, setUsers] = useState<{id: string}[]>([])
  const [points, setPoints] = useState(0)
  const [points_week, setPointsWeek] = useState(0)
  const [activity, setActivity] = useState("You haven't earned any points yet, start today!")


  useEffect(() => {
    if (session) getProfile();
    if (session) getAllUsers();
  }, [session])

  async function getAllUsers() {
    const {data, error} = await supabase.from('profiles').select('id');
    if (error) console.log(error?.message);
    setUsers(data ?? []);
    console.log("getAllUsers called")
  }

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, points, last_activity, points_week`)
        .eq('id', session?.user.id)
        .single()

      
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setPoints(data.points)
        setActivity(data.last_activity)
        setPointsWeek(data.points_week)

        console.log("points: "+data.points+"     points_week: "+data.points_week)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
      console.log("getProfile called")
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updatePoints() {
    try {

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`points, last_activity, points_week`)
        .eq('id', session?.user.id)
        .single()

      const tempPoints = pointsToday(data.last_activity ? data.last_activity : new Date(), data.points ? data.points : 0) + 1
      const tempPointsWeek = pointsThisWeek(data.last_activity ? data.last_activity : new Date(), data.points_week ? data.points_week : 0) + 1

      const updates = {
        id: session?.user.id,
        points: tempPoints,
        points_week: tempPointsWeek,
        last_activity: new Date(),
      }

      await supabase.from('profiles').upsert(updates)


      setPoints(tempPoints)
      setPointsWeek(tempPointsWeek)
      setActivity(daysAgo(data.last_activity))

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>

      <View>
        <Avatar
            size={ 100 }
            url={avatarUrl}
            onUpload={(url: string) => {
            setAvatarUrl(url)
            updateProfile({ username, website, avatar_url: url })
            }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          color={COLORS.button}
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <Text>Last activity: {activity}</Text>

      <View style={styles.verticallySpaced}>
        <Button 
          title="Sign Out" 
          color={COLORS.button}
          onPress={() => supabase.auth.signOut()} 
        />
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})