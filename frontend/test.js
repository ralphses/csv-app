import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Button, StyleSheet, View } from 'react-native';

const pickCSV = async () => {
  // Request access to specific file types (CSV in this case)
  const result = await DocumentPicker.getDocumentAsync({
    type: 'text/csv',
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    const readFile = async () => {
      try {
        const contents = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });

        console.log("CSV contents:", contents);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    };

    readFile();
  }
};

const App = () => {
  return (
    <View style={styles.container}>
      <Button title="Pick a CSV file" onPress={pickCSV} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take up the whole screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
});
