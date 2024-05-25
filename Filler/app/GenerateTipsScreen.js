import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase'

export default function GenerateTipsScreen() {
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message"
        value={text}
        onChangeText={setText}
      />
      <Button title="Send" onPress={handlePress} />
      <Text style={styles.response}>{response}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
  response: {
    marginTop: 20,
    fontSize: 16,
  },
});
