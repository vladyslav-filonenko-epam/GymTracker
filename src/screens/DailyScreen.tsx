import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

export function DailyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
