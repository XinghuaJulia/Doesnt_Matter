import { View, Text, TouchableOpacity, Image, Linking, Alert } from "react-native";
import { supabase } from '../lib/supabase';
import { pointsThisWeek, pointsToday, daysAgo } from './utils/helper'

// import styles from "../constants/NewsCard.style";
import styles from "../constants/NewsCard2.style";



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

    item.title != "[Removed]" ?
      <TouchableOpacity activeOpacity={1} style={styles.container} onPress={handlePress}>
        <Image
          source={{
            uri: item?.urlToImage ?? 'https://picsum.photos/800',
            cache: 'force-cache',
          }}
          resizeMode={'cover'}
          style={styles.image}
        />
        <View>
          <Text style={styles.text}>{item?.title}</Text>
          <Text style={styles.timestamp}>{daysAgo(item.publishedAt)}</Text>
        </View>
      </TouchableOpacity>
       : <View></View> 
    )
}

//           <View style={styles.container}>
//             <TouchableOpacity
//               onPress={() => {handlePress()} }
//               style={styles.horizontalContainer}
//             >
//               <Image 
//                 source= {{ uri: item.urlToImage }}
//                 resizeMode= "contain"
//                 style= { styles.newsImage }
//                 />
//               <Text style= {styles.headerTitle}>{ item.title }</Text>
//             </TouchableOpacity> 
//             <Text style= {styles.descTitle}>{ daysAgo(item.publishedAt) }</Text>
//           </View>
//         : <View></View> 

export default NewsCard;