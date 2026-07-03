import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

export function WorkScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Work</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
