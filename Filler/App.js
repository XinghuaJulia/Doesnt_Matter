import 'react-native-url-polyfill/auto'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TrashUploadScreen from './app/TrashUploadScreen'
import LoginScreen from './app/LoginScreen'
import GameScreen from './app/GameScreen'
import HomeScreen from './app/HomeScreen'
import Account from './components/Account'


const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Upload Trash" component={TrashUploadScreen} />
        <Stack.Screen name="Virtual Pet" component={GameScreen} />
        <Stack.Screen name="Account" component={Account} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}