import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { StyleSheet, View, Alert, Text, Image, TouchableOpacity } from 'react-native'
import { Button } from '@rneui/themed'


import { daysAgo, pointsThisWeek, pointsToday } from './utils/helper'

import { COLORS } from '../constants/theme'

const turtleHappy1 = require('../assets/turtle_sprites/turtle_happy1.png')
const turtleHappy2 = require('../assets/turtle_sprites/turtle_happy2.png')
const turtleHappy3 = require('../assets/turtle_sprites/turtle_happy3.png')
const turtleHappy4 = require('../assets/turtle_sprites/turtle_happy4.png')
const turtleHappy5 = require('../assets/turtle_sprites/turtle_happy5.png')
const turtleSad = require('../assets/turtle_sprites/turtle_sad.png')

const turtleHappy = [turtleHappy1, turtleHappy2, turtleHappy3, turtleHappy4, turtleHappy5]
 
export default function HomeScreen_login({ route }) {
  const { session } = route.params

  useEffect(() => {
    if (session) getProfile();  
    if (!session) supabase.auth.signOut();
  }, [])

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("Don't have a username... Create one now!")
  const [avatarUrl, setAvatarUrl] = useState('')
  const [users, setUsers] = useState<{id: string}[]>([])
  const [points, setPoints] = useState(0)
  const [points_week, setPointsWeek] = useState(0)
  const [activity, setActivity] = useState("You haven't earned any points yet, start today!")
  const [petName, setPetName] = useState('Turtle')



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
        .select(`username, avatar_url, points, last_activity, points_week, pet_name`)
        .eq('id', session?.user.id)
        .single()

      console.log("profile status: " + status)
      
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setPoints(data.points)
        setActivity(daysAgo(data.last_activity))
        setPointsWeek(data.points_week)
        setPetName(data.pet_name)

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
      setActivity(daysAgo(new Date()))

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
      const request = new Request('http://172.19.163.15:3000/');

      const response = await fetch(request)

      const json = await response.json()

      console.log(json)
    }
    catch (error) {
      console.error('Error:', error.response ? JSON.stringify(error.response.data) : error.message);
    } 
  }

  const virtualPetState = () => {
    return points > 10 
      ? turtleHappy[Math.floor(Math.random() * 5)]
      : turtleSad
  }

  return (
    <View style={styles.container}>

      <View>
        <View style={styles.horizontalContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={[ styles.avatar, styles.icon ]} />
          ) : (
            <View style={[ styles.avatar, styles.icon ]} />
          )}
          <View>
            <Text style={ styles.title }>{username} </Text>
            <Text>Last activity: {activity}</Text>
          </View>
        </View>

        <Text>Your points today: {points || 0}</Text>
        <Text>Your points this week: {points_week || 0}</Text>
        <Text>{petName}'s state: {points > 10 ? "happy" : "sad"}</Text>
      </View>


      <View style={{alignItems: "center"}}>
        <Image source={ virtualPetState() } style={{width: 300, height:300}}/>
      </View>


      <View>
          <Button
            title={'add points'}
            color={COLORS.button}
            onPress={() => updatePoints()}
            disabled={loading}
          />
        <Text>Your pet {petName} is {points > 10 ? "happy, keep up the good work!" : "sad, start recycling today!"}</Text>
      </View>
      


      {/* 

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

      temporarily testing bottom tab
      removed route.params requirements
      */}
      
      
      {/*

      <Button title={"testing"} onPress={handlePress}/>
      
      */}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  horizontalContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
    color: COLORS.button,
  },
  title: {
    fontSize: 28,
  },
  icon: {
    width: 60,
    height: 60,
  },
  avatar: {
    backgroundColor: 'grey',
    borderRadius: 50,
  },
  containerTop: {
    flex: 3,
  },
  containerMiddle: {
    flex: 6,
    alignItems:"center",
  },
  containerBottom: {
    flex: 1,
  }
})