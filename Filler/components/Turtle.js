import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image, TextInput } from 'react-native';

const deadFace = require('../assets/charface/dead_face.png');
const happyFace = require('../assets/charface/happy_face.png');

export default function Turtle() {
  const [name, setName] = useState("yertle the turdhole");
  const [happiness, setHappiness] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setHappiness((prev) => Math.max(prev - 1, 0));
    }, 100); // Decrease happiness every 100 ms

    return () => clearInterval(interval);
  }, []);

  const playWithPet = () => {
    setHappiness((prev) => prev + 10);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Yertle the turtle is ye name"
        value={name}
        onChangeText={setName}
      />
      <Text>Happiness: {happiness}</Text>
      <Button title="Play with Pet" onPress={playWithPet} />
    
      <Text>Current state: {happiness > 50 ? 'happy' : 'sad'}</Text>
      <Text style={styles.text}> Your pet will die if happiness is less than 50. In future: implement point system where user gain points through recycling</Text>
    </View>
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
      height: 100,
      width: 100,
      justifyContent: true,
    },
    button: {
      height: 50,
      width: 200,
    }
  });

