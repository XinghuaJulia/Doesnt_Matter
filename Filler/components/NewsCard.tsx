import { View, Text, TouchableOpacity, Image, Linking, Alert } from "react-native";
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase';
import { daysAgo, pointsThisWeek, pointsToday } from './utils/helper'

import styles from "../constants/NewsCard.style";



const NewsCard = ({ item, session }) => {
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
          console.log("points added!")
      
          if (error) {
            throw error
          }
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert(error.message)
          }
        } finally {
        }
      }

    const handlePress = () => {
        updatePoints();
        Linking.openURL( item.url );
    }

    return (
        <TouchableOpacity
            onPress={() => {handlePress()} }
        >
            <View>
                <Image 
                  source= {{ uri: item.urlToImage }}
                  resizeMode= "contain"
                  style= { styles.newsImage }
                  />
            </View>
            <Text style= {styles.headerTitle}>{ item.title }</Text>
            <Text>{ item.source.name } { item.publishedAt }</Text>

            
        </TouchableOpacity>
    )
}

export default NewsCard;