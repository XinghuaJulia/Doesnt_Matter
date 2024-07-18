import React, { useEffect, useState } from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { COLORS } from '../constants/theme'
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js'

import { daysAgo, pointsThisWeek, pointsToday } from '../components/utils/helper'



export default function TrashUploadScreen( {route} ) {
  const { session } : { session: Session } = route.params

  const [username, setUsername] = useState('')
  const [users, setUsers] = useState<{id: string}[]>([])
  const [points, setPoints] = useState(0)
  const [points_week, setPointsWeek] = useState(0)
  const [activity, setActivity] = useState("You haven't earned any points yet, start today!")



  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [text, setText] = useState('');
  const [tips, setTips] = useState('Please scan trash for tips!')

  
  useEffect(() => {
    getPermissionAsync();
    if (session) getProfile();
    // if (session) getAllUsers();
  }, [session]);

  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
      size: 0.1,
    });

    //console.log("Image picker result:", JSON.stringify(result)); // Log the full result to see what is returned

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log("Picked image URI:", uri); // Confirm URI is received
      setSelectedImage(uri);
      uploadImage(uri);
    } else {
      console.log("Image picker issue: Either canceled or no URI", JSON.stringify(result));
      alert('You did not select any image or the image URI is missing.');
    }
};

const uploadImage = async (imageUri) => {
  if (!imageUri) {
    console.log("No image URI available");
    alert("No image URI available to upload.");
    return;
  }
  setLoading(true);
  try {
    const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });


    const response = await supabase.rpc('generate_image', {base64imagedata: base64ImageData});

    setText(response.data.responses[0].labelAnnotations[0].description)
    console.log(response.data.responses[0].labelAnnotations[0].description)

  } catch (error) {
    console.error('Error during the image upload process:', error.response ? JSON.stringify(error.response.data) : error.message);
    Alert.alert('Error', 'Failed to upload image and get predictions: ' + (error.response ? error.response.data.error : error.message));
  } finally {
    setLoading(false);
    updatePoints();
  }
};

const handlePress = async () => {
  try {
    if (!text) {
      alert("You must upload an image first to generate tips")
    } else {
      const recyclable = await supabase.rpc('generate_text', {description: 'Is ' + text +' generally fit for recycling, answer only using yes or no.'});
      console.log(recyclable)
      const recyclableStatus = JSON.stringify(recyclable.data.choices[0].message.content);

      console.log(recyclableStatus.toLowerCase() + recyclableStatus.toLowerCase().includes("yes"));

        if (recyclableStatus.toLowerCase().includes("yes")) {
          console.log("item can be recycled");

          const result = await supabase.rpc('generate_text', {description: 'How to clean ' + text + 'so that it is fit for recycling, keep response under 100 characters.'});

          console.log(result);
          setTips(result.data.choices[0].message.content);
        } else {
          setTips("Item not recyclable");
        }
      }
  } catch (error) {
    console.error(error);
  }
}


async function getAllUsers() {
  const {data, error} = await supabase.from('profiles').select('id');
  if (error) console.log(error?.message);
  setUsers(data ?? []);
  console.log("getAllUsers called")
}

async function getProfile() {
  try {
    setLoading(true)
    if (!session?.user) throw new Error('No user on the session!')

    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, points, last_activity, points_week`)
      .eq('id', session?.user.id)
      .single()
    
    if (error && status !== 406) {
      throw error
    }

    if (data) {
      setUsername(data.username)
      setPoints(data.points)
      setActivity(data.last_activity)
      setPointsWeek(data.points_week)

      console.log("points: "+data.points+"     points_week: "+data.points_week)
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message)
    }
  } finally {
    setLoading(false)
    console.log("getProfile called")
  }
}


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


    setPoints(tempPoints)
    setPointsWeek(tempPointsWeek)
    setActivity(daysAgo(data.last_activity))

    if (error) {
      throw error
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message)
    }
  } finally {
    setLoading(false)
  }
}


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Upload trash here</Text>
      <Button title="Choose a photo" color={COLORS.button} onPress={pickImageAsync} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image}>
          {predictions && predictions.map((prediction, index) => (
            <View key={index} style={{
              borderWidth: 2,
              borderColor: 'red',
              position: 'absolute',
              left: prediction.x * 400,
              top: prediction.y * 400,
              width: prediction.width * 400,
              height: prediction.height * 400,
            }}>
              <Text style={styles.predictionText}>{`${prediction.class} ${Math.round(prediction.confidence * 100)}%`}</Text>
            </View>
          ))}
        </Image>
      )}
      <Text>{ text }</Text>
      <Button title="Generate tips"color={COLORS.button} onPress={handlePress} />
      <Text>Tips: { tips }</Text>
      <Text>Your points today: {points || 0}</Text>
      <Text>Your points this week: {points_week || 0}</Text>
      <Text>Last activity: {activity}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    height: 300,
    width: 300,
    marginTop: 20,
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 3,
    borderColor: COLORS.button,
    borderRadius: 20,
  },
  predictionText: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
