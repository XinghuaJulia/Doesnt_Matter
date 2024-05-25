import * as React from 'react';
import {useState} from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function GptScreen({ navigation }) {
  const [text, setText] = useState('');
  const handlePress = () => console.log("text died");
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}> Open up App.js to start working on your app! ffffffffffffffffffffffffffffffffffff</Text>
      <TextInput 
        placeholder='Input trash type here'
        onChangeText={newText => setText(newText)}
        defaultValue={text}
        />
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
      <Button title="generate tips" onPress={() => navigation.navigate("Gpt")} />

      <Text style={styles.text}> completion </Text>

      <Button title="Go to upload trash screen" onPress={() => navigation.navigate("TrashUploadScreen")} />
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
});
