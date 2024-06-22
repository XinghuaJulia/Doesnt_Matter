import { View, Text, TouchableOpacity, Image, Linking } from "react-native";

import styles from "../constants/NewsCard.style";

const NewsCard = ({ item, selectedNews }) => {
    return (
        <TouchableOpacity
            onPress={() => {Linking.openURL( item.url )} }
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