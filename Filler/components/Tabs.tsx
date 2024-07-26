import * as React from 'react'
import { Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Session } from '@supabase/supabase-js'
import TrashUploadScreen from '../app/TrashUploadScreen'
import NewsScreen from '../app/NewsScreen'
import Account from '../app/Account'
import HomeScreen_login from './HomeScreen_login';



import { COLORS } from '../constants/theme'


const homeIcon = require('../assets/icons/home.png')
const profileIcon = require('../assets/icons/user.png')
const trashIcon = require('../assets/icons/trash.png')
const newsIcon = require('../assets/icons/newspaper.png')


const Tab = createBottomTabNavigator();

export default function Tabs({session}: {session: Session}) {

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen_login} initialParams={{ session: session }} 
        options={{tabBarIcon: 
          ({focused}) => {
            return <Image style={{
              width: 24,
              height: 24,
              resizeMode: 'stretch',
              tintColor: focused ? COLORS.darkGreen : "grey"
            }}
            source={homeIcon}/>
          }, tabBarActiveTintColor: COLORS.darkGreen
      }}/>
      <Tab.Screen name="News" component={NewsScreen} initialParams={{ session: session }} options={{tabBarIcon: 
          ({focused}) => {
            return <Image style={{
              width: 24,
              height: 24,
              resizeMode: 'stretch',
              tintColor: focused ? "green" : "grey"
            }}
            source={newsIcon}/>
          }, tabBarActiveTintColor: COLORS.darkGreen
      }}/>
      <Tab.Screen name="Upload Trash" component={TrashUploadScreen} initialParams={{ session: session }} options={{tabBarIcon: 
          ({focused}) => {
            return <Image style={{
              width: 24,
              height: 24,
              resizeMode: 'stretch',
              tintColor: focused ? "green" : "grey"
            }}
            source={trashIcon}/>
          }, tabBarActiveTintColor: COLORS.darkGreen
      }}/>
      <Tab.Screen name="Account" component={Account} initialParams={{ session: session }} options={{tabBarIcon: 
          ({focused}) => {
            return <Image style={{
              width: 24,
              height: 24,
              resizeMode: 'stretch',
              tintColor: focused ? "green" : "grey"
            }}
            source={profileIcon }/>
          }, tabBarActiveTintColor: COLORS.darkGreen
      }}/>
    </Tab.Navigator>
  )
}