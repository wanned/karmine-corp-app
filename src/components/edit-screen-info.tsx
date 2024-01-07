import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text style={styles.getStartedText}>Open up the code for this screen:</Text>

        <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
          <Text>{path}</Text>
        </View>

        <Text style={styles.getStartedText}>
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
});
