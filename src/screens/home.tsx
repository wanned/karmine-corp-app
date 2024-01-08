import { StyleSheet, Text, View } from 'react-native';

import EditScreenInfo from '../components/edit-screen-info';

import { Typographies } from '~/shared/components/typographies';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} />
      <EditScreenInfo path="src/screens/one.tsx" />

      <Typographies.Title1>Typographies.Title1</Typographies.Title1>
      <Typographies.Title2>Typographies.Title2</Typographies.Title2>
      <Typographies.Title3>Typographies.Title3</Typographies.Title3>
      <Typographies.Body>Typographies.Body</Typographies.Body>
      <Typographies.Label>Typographies.Label</Typographies.Label>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  separator: {
    backgroundColor: 'gray',
    height: 1,
    marginVertical: 30,
    opacity: 0.25,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
