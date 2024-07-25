import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './app/LoginScreen'



import { COLORS } from './constants/theme'
import Tabs from './components/Tabs'



const Stack = createNativeStackNavigator()

export default function App() {
  return (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            contentStyle:{
              backgroundColor: COLORS.background,
            },
            headerShown: false,
          }}>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>    
  )
    
}