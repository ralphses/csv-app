import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { parseCSV } from './parseCSV.js';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';

const screenWidth = Dimensions.get('window').width;

const ChartScreen = ({ route, navigation }) => {
  const { file, type } = route.params;
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data, summary } = await parseCSV(file);
      setChartData(data);
      setSummary(summary);

      try {
        // Convert file content to base64
        const fileBase64 = Buffer.from(file).toString('base64');

        // Create JSON payload
        const payload = {
          file: fileBase64,
          graph_type: type,
        };

        const response = await axios.post('http://127.0.0.1:5000/convert', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        // Extract the image URL
        const imageUrl = response.data.image_url;

        // Replace backslashes with forward slashes
        const modifiedImageUrl = imageUrl.replace(/\\/g, '/');

        // Set the modified image URL
        setImageUrl(modifiedImageUrl);
      } catch (error) {
        // console.error('Error creating chart:', error);
        alert('Unsupported file type or format');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [file, type]);

  const renderStatistics = () => {
    if (!summary) return null;

    return Object.keys(summary).map((column) => (
      <View key={column} style={styles.statisticContainer}>
        <Text style={styles.statisticTitle}>{column}</Text>
        <Text style={styles.statisticText}>Mean: {summary[column].mean}</Text>
        <Text style={styles.statisticText}>Median: {summary[column].median}</Text>
        <Text style={styles.statisticText}>Mode: {summary[column].mode}</Text>
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.chartImage}
              resizeMode="contain"
            />
          )}
          {renderStatistics()}
          <Button title="Close" onPress={() => navigation.goBack()} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  chartImage: {
    width: screenWidth - 32,
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
    alignSelf: 'center',
  },
  statisticContainer: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statisticTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333333',
  },
  statisticText: {
    fontSize: 14,
    color: '#555555',
  },
});

export default ChartScreen;
