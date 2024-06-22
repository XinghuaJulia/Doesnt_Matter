import * as React from 'react';
import {useState} from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { supabase } from '../lib/supabase'
import axios from 'axios';


export default function HomeScreen({ navigation }) {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('Hi');

  const handlePress = async () => {
    try {
      const recyclable = await supabase.rpc('generate_text', {description: 'Is ' + text +' generally fit for recycling, answer only using yes or no.'});

      const recyclableStatus = JSON.stringify(recyclable.data.choices[0].message.content);

      console.log(recyclableStatus.toLowerCase() + recyclableStatus.toLowerCase().includes("yes"));

        if (recyclableStatus.toLowerCase().includes("yes")) {
          console.log("item can be recycled");

          const result = await supabase.rpc('generate_text', {description: 'How to clean ' + text + 'so that it is fit for recycling, keep    response under 100 characters.'});

          console.log(result);
          setResponse(result.data.choices[0].message.content);
        } else {
          setResponse("Item not even recyclable. Go put yourself into the bin to make the environemtn clean.");
        }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Go to News" onPress={() => navigation.navigate("News")} />
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
      <Button title="Go to upload trash screen" onPress={() => navigation.navigate("Upload Trash")} />
      <Button title="Go to virtual pet screen" onPress={() => navigation.navigate("Virtual Pet")} />


      <Text style={styles.text}> Input the trash you want to be, not the trash you are.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the trash. NOW."
        value={text}
        onChangeText={setText}
      />
      <Button title="generate tips" onPress={handlePress} />
      <Text style={styles.response}>{response}</Text>

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
