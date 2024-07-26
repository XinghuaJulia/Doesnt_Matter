import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Text, ScrollView } from 'react-native'
import { Button, Input } from '@rneui/themed'
import Avatar from '../components/Avatar'
import { daysAgo, pointsThisWeek, pointsToday } from '../components/utils/helper'

import { COLORS } from '../constants/theme'


export default function Account({ route }) {
  const { session } = route.params

  useEffect(() => {
    if (session) getProfile();
    if (session) getAllUsers();
  }, [session])

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [petName, setPetName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [users, setUsers] = useState<{id: string}[]>([])
  const [points, setPoints] = useState(0)
  const [points_week, setPointsWeek] = useState(0)
  const [activity, setActivity] = useState("You haven't earned any points yet, start today!")


  

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
        .select(`username, pet_name, avatar_url, points, last_activity, points_week`)
        .eq('id', session?.user.id)
        .single()

      
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setPetName(data.pet_name)
        setAvatarUrl(data.avatar_url)
        setPoints(data.points)
        setActivity(daysAgo(data.last_activity))
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
    petName,
    avatar_url,
  }: {
    username: string
    petName: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')
      if (username.length > 20) Alert.alert('Username cannot bet longer than 20 characters!')
      if (petName.length > 20) Alert.alert('Pet name cannot be longer than 20 characters!')

      else {
        const updates = {
          id: session?.user.id,
          username,
          pet_name: petName,
          avatar_url,
          updated_at: new Date(),
        }

        const { error } = await supabase.from('profiles').upsert(updates)
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

      <View style={{alignContent:"center", alignItems:"center"}}>
        <Avatar
            size={ 100 }
            url={avatarUrl}
            onUpload={(url: string) => {
            setAvatarUrl(url)
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
        <Input label="Pet Name" value={petName || ''} onChangeText={(text) => setPetName(text)} />
      </View>

      <Text style={styles.desc}>Last activity: {activity}</Text>
      <Text style={styles.desc}>Daily points: {points || 0}</Text>
      <Text style={styles.desc}>Weekly points: {points_week || 0}</Text>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          color={COLORS.button}
          onPress={() => updateProfile({ username, petName, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      

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
  desc: {
    color: COLORS.gray,
  },
})