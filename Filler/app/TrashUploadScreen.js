import * as React from 'react';
import {useState} from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function TrashUploadScreen() {
  const [selectedImage, setSelectedImage] = useState(null);

  const ImageViewer = ({ placeholderImageSource, selectedImage}) => {
    const imageSource = selectedImage  ? { uri: selectedImage } : placeholderImageSource;

    return <Image source={imageSource} style={styles.image} />;
  }

  const CustomButton = ({ label, theme, onPress}) => {
    if (theme === "primary") {
      return (
        <View>
          <Pressable
            style={[styles.button, { backgroundColor: '#fff' }]}
            onPress={onPress}
          />
        </View>
      );
    }
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}> Upload your trashy images here  </Text>
      <Button theme="primary" title="Choose a photo" onPress={pickImageAsync} />
      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImageSource={'../assets/favicon.png'}
          selectedImage={selectedImage}
        />
      </View>
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
  },
  image: {
    height: 200,
    width: 200,
  },
  button: {
    height: 50,
    width: 200,
  }
});
