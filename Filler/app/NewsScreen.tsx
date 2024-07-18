import { useEffect, useState } from "react";
import { View, ScrollView, FlatList, SafeAreaView, Text, ActivityIndicator } from "react-native";
import axios from "axios";
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

import { COLORS, SIZES } from "../constants/theme";
import styles from "../constants/NewsCard.style";

import NewsCard from '../components/NewsCard';


export default function NewsScreen( {route} ) {
    const { session } : { session: Session } = route.params

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const error = false;

    const fetchData = async () => {
        setIsLoading(true);

        try {
          const searchField = encodeURI("environment AND sustainable")
    
          const result = await supabase.rpc('generate_news', {description: 'Is ' +' generally fit for recycling, answer only using yes or no.'});
    
          setData(result.data.articles);
        } catch (error) {
          console.error(error);
        } finally {
            setIsLoading(false);
        }
      };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => {
        setIsLoading(true);
        fetchData();
    }

    return (
        <View style={styles.headerTitle}>
            <Text>News Here</Text>

            <View style={styles.cardsContainer}>
                {isLoading ? (
                    <ActivityIndicator size= "large" color= {COLORS.primary}/>
                ) : error ? (
                    <Text>Something went wrong</Text>
                ) : (
                    <FlatList
                        data={ data }
                        renderItem={( { item }) => (
                            <NewsCard
                              item = { item }
                              session = { session }
                            />
                        )}
                        contentContainerStyle={{ columnGap: SIZES.large }}
                    />
                )}
            </View>
        </View>
    )
}