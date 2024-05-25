import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import * as React from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Account from './components/Account'
import { View, Button, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import GptScreen from './app/HomeScreen'
import TrashUploadScreen from './app/TrashUploadScreen'
import GenerateTipsScreen from './app/GenerateTipsScreen'
import LoginScreen from './app/HomeScreen'


const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="GptScreen" component={GptScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="TrashUploadScreen" component={TrashUploadScreen} />
        <Stack.Screen name="GenerateTipsScreen" component={GenerateTipsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}