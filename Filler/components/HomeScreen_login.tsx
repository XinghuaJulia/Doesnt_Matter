import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Text, Image, TouchableOpacity } from 'react-native'
import { Button } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native'
import { daysAgo, pointsThisWeek, pointsToday } from './utils/helper'

import { COLORS } from '../constants/theme'
const homeIcon = require('../assets/icons/home.png')
const profileIcon = require('../assets/icons/user.png')
const trashIcon = require('../assets/icons/trash.png')
const newsIcon = require('../assets/icons/newspaper.png')



export default function HomeScreen_login({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [users, setUsers] = useState<{id: string}[]>([])
  const [points, setPoints] = useState(0)
  const [points_week, setPointsWeek] = useState(0)
  const [activity, setActivity] = useState("You haven't earned any points yet, start today!")

  const navigation = useNavigation()

  useEffect(() => {
    if (session) getProfile();
    if (session) getAllUsers();
    if (!session) supabase.auth.signOut();
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
        .select(`username, avatar_url, points, last_activity, points_week`)
        .eq('id', session?.user.id)
        .single()

      console.log("profile status: " + status)
      
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setPoints(data.points)
        setActivity(data.last_activity)
        setPointsWeek(data.points_week)

        downloadImage(data.avatar_url)

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

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
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

  const handlePress = async () => {
    try {
      const request = new Request('http://172.19.163.15:3000/', {
        method: "POST",
        body: JSON.stringify({image: "aSB3YW50IHRvIGRpZQ=="}),
      });

      const response = await fetch(request)

      console.log(response)

      console.log(await fetch("http://172.19.163.15:3000/"))
    }
    catch (error) {
      console.error('Error during the image upload process:', error.response ? JSON.stringify(error.response.data) : error.message);
    } 
  }

  return (
    <View style={styles.container}>

      <View>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={[ styles.avatar, styles.icon ]} />
        ) : (
          <View style={[ styles.avatar, styles.icon ]} />
        )}
      </View>

      <View>
        <Text style={ styles.title }>{username} </Text>
      </View>

      <View>
        <Button
          title={'add points'}
          color={COLORS.button}
          onPress={() => updatePoints()}
          disabled={loading}
        />
      </View>
      <Text>Your points today: {points || 0}</Text>
      <Text>Your points this week: {points_week || 0}</Text>
      <Text>Last activity: {activity}</Text>

      <Button title="Go to virtual pet screen" color={COLORS.button} onPress={() => navigation.navigate("Virtual Pet")} />

      

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" color={COLORS.button} onPress={() => supabase.auth.signOut()} />
      </View>


      <View>
        <View style={ styles.bottomTabs }>
          <TouchableOpacity>
            <Image source={ homeIcon } style= { styles.icon }/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Upload Trash", {
            session: session
          })}>
            <Image source={ trashIcon } style= { styles.icon }/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("News", {
            session: session
          })}>
            <Image source={ newsIcon } style= { styles.icon }/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Account", {
            session: session
          })}>
            <Image source={ profileIcon } style= { styles.icon }/>
          </TouchableOpacity>
        </View>
      </View>
      
      <Button title={"testing"} onPress={handlePress}/>

    </View>
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
    color: COLORS.button,
  },
  mt20: {
    marginTop: 20,
  },
  title: {
    fontSize: 28,
  },
  icon: {
    width: 50,
    height: 50,
  },
  avatar: {
    backgroundColor: 'grey',
    borderRadius: 50,
  },
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  bottomAlign: {
    marginTop: 290,
  }
})