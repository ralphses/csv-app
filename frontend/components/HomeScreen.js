import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';

const chartTypes = [
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Line Chart', value: 'line' },
  { label: 'Histogram Chart', value: 'hist' },
  { label: 'Area Chart', value: 'area' },
  { label: 'Box Chart', value: 'box' },
];

const HomeScreen = ({ navigation }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [chartType, setChartType] = useState('bar');

  const handleFilePicker = async () => {
    try {
      if (Platform.OS === 'web') {
        // Create and simulate a file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setCsvFile(event.target.result);
            };
            reader.readAsText(file);
          }
        };
        input.click();
      } else {
        // For native
        const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          const contents = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });
          setCsvFile(contents);
        }
      }
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const handleSubmit = () => {
    if (csvFile && chartType) {
      navigation.navigate('Chart', { file: csvFile, type: chartType });
    } else {
      alert('Please select a CSV file and a chart type');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Page Information */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Dynamic Statistics Visualization Generator</Text>
          <Text style={styles.subHeaderText}>Select a CSV file and choose a chart type to visualize data dynamically.</Text>
        </View>

        {/* File Picker Button */}
        <TouchableOpacity style={styles.button} onPress={handleFilePicker}>
          <Ionicons name="document-attach-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Select CSV File</Text>
        </TouchableOpacity>

        {/* Selected File Display */}
        {csvFile && <Text style={styles.fileText}>File Selected</Text>}

        {/* Chart Type Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={chartType}
            onValueChange={(itemValue) => setChartType(itemValue)}
            style={styles.picker}
          >
            {chartTypes.map((chart) => (
              <Picker.Item key={chart.value} label={chart.label} value={chart.value} />
            ))}
          </Picker>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Generate Chart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  fileText: {
    marginVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  pickerContainer: {
    borderColor: '#6200ee',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#03dac5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeScreen;
