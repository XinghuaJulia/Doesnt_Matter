import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Text, Image, TouchableOpacity } from 'react-native'


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
    if (session) setInterval(getProfile, 15000);
    if (!session) supabase.auth.signOut();
  }, [])

  

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("Don't have a username... Create one now!")
  const [avatarUrl, setAvatarUrl] = useState('')
  const [points, setPoints] = useState(0)
  const [points_week, setPointsWeek] = useState(0)
  const [activity, setActivity] = useState("")
  const [petName, setPetName] = useState('Turtle')



  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url, points, last_activity, points_week, pet_name`)
        .eq('id', session?.user.id)
        .single()
      
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

      const tempPoints = pointsToday(data.last_activity, data.points) + 1
      const tempPointsWeek = pointsThisWeek(data.last_activity, data.points_week) + 1

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
    return points >= 1 
      ? turtleHappy[Math.floor(Math.random() * 5)]
      : turtleSad
  }

  return (
    <View style={styles.container}>
      <View style= {styles.containerTop}>
        <View style={styles.horizontalContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={[ styles.avatar, styles.icon ]} />
          ) : (
            <View style={[ styles.avatar, styles.icon ]} />
          )}
          <View>
            <Text style={ styles.title }>{username} </Text>
            <Text style={{ color: COLORS.gray}}>Last activity: {activity}</Text>
          </View>
        </View>

        <Text style={ styles.tips }>Psst, earn points by uploading a trash image, generating tips, or reading a news article!</Text>
      </View>


      <View style={styles.containerMiddle}>
        <Image source={ virtualPetState() } style={{width: 300, height:300}}/>
      </View>

      

      <View style={styles.containerBottom}>
        {/*
          <Button
            title={'add points'}
            color={COLORS.button}
            onPress={() => updatePoints()}
            disabled={loading}
          />
        */}
        
        <Text style={ styles.petStatus }>Your pet {petName} is {points >= 1 ? "happy, keep up the good work!" : "sad, start recycling today!"}</Text>
      </View>

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
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
    flex: 2,
  },
  petStatus: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.gray,
    margin: 20,
  },
  tips: {
    color: COLORS.gray,
    margin: 20,
    textAlign: "center",
  }
})