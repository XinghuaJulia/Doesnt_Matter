import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Image, Text, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'

import { COLORS } from '../constants/theme'

const turtleGreetings = require('../assets/turtle_sprites/turtle_greetings.png')

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={{alignItems:"center"}}>
        <Text style={styles.greetingsText}>Welcome to Filler!</Text>
        <Text style={styles.greetingsText}>Ready to live more sustainably?</Text>
        <Image source={ turtleGreetings } style={{width: 300, height:300, marginTop: 20}}/>
      </View>

      <View style={styles.verticallySpaced}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign in" color={ COLORS.button } disabled={loading} onPress={() => signInWithEmail()} />
      </View>

      <View style={styles.horizontalContainer}>
        <Text style={{color: COLORS.gray}}>Don't have an account yet? </Text>
        <TouchableOpacity onPress={() => signUpWithEmail()}>
          <Text style={{ color: COLORS.button }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
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
  horizontalContainer: {
    flexDirection: "row",
    alignSelf: "center",
  }, 
  greetingsText: {
    fontSize: 20,
    marginHorizontal: 10,
    textAlign: "center",
    fontWeight: "thin",
  },
})