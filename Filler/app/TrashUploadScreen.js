import React, { useEffect, useState } from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, Image, Alert, ActivityIndicator, ImageBackground, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios, { AxiosHeaders } from 'axios';


export default function TrashUploadScreen( {navigation} ) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [text, setText] = useState('');

  


  useEffect(() => {
    getPermissionAsync();
  }, []);

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
      size: 0.1
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
    const apiURL = `BACKEND SERVER IP ADDRESS`;

    const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // const requestData = {
    //   requests: [
    //     {
    //       image: base64ImageData
    //     }
    //   ]
    // };

    // console.log(axios.get(apiURL));

    //const headers = new AxiosHeaders({'image': base64ImageData});
    //console.log(headers.get('image'));

    // const apiResponse2 = await axios.post(apiURL, {
    //   image: "hello world"
    // });


    // const apiResponse = await fetch(apiURL, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     image: base64ImageData
    //   })
    // })

    console.log(await fetch('apiURL', {
      method: 'GET'
    }));
    //fetch request cannot be sent to somewhere insecure

  } catch (error) {
    console.error('Error during the image upload process:', error.response ? JSON.stringify(error.response.data) : error.message);
    Alert.alert('Error', 'Failed to upload image and get predictions: ' + (error.response ? error.response.data.error : error.message));
  } finally {
    setLoading(false);
  }
};



  return (
    <SafeAreaView style={styles.container}>
      <Button title="Go to upload trash screen" onPress={() => navigation.navigate("TrashUploadScreen")} />
      <Button title="Go to virtual pet screen" onPress={() => navigation.navigate("GameScreen")} />
        
      <Text style={styles.text}>Upload your trashy images here</Text>
      <Button title="Choose a photo" onPress={pickImageAsync} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {selectedImage && (
        <ImageBackground source={{ uri: selectedImage }} style={styles.image}>
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
        </ImageBackground>
      )}
      <Text>{text}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    height: 400,
    width: 400,
    marginTop: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  predictionText: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
