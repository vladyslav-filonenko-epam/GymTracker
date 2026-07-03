import React from 'react';

import { ImageBackground, StyleSheet, Text } from 'react-native';

import mountain from '../images/mountain.jpg';

const TITLE_COLOR = 'white';

export function HomeScreen() {
  return (
    <ImageBackground source={mountain} style={styles.container} resizeMode="cover">
      <Text style={styles.title}>Home</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TITLE_COLOR,
  },
});
