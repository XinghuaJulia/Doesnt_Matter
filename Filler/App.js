import 'react-native-url-polyfill/auto'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TrashUploadScreen from './app/TrashUploadScreen'
import GenerateTipsScreen from './app/GenerateTipsScreen'
import LoginScreen from './app/LoginScreen'
import GameScreen from './app/GameScreen'
import HomeScreen from './app/HomeScreen'


const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeSceeen" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="TrashUploadScreen" component={TrashUploadScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}