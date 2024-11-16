import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const DetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [details, setDetails] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await fetch(`https://api.rapidmock.com/api/vikuman/v1/movies?id=${id}`);
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const response = await fetch('https://api.rapidmock.com/api/vikuman/v1/mylist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId: id, status }),
      });
      const responseData = await response.json();
      setSelectedStatus(status);
      Alert.alert('Response', JSON.stringify(responseData.message));
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  if (!details) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: details.poster_url }} style={styles.image} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>{details.title}</Text>
          <Text style={styles.label}>Rating: <Text style={styles.value}>{details.rating}</Text></Text>
          <Text style={styles.label}>Type: <Text style={styles.value}>{details.type}</Text></Text>
          <Text style={styles.label}>Release Date: <Text style={styles.value}>{details.release_date}</Text></Text>
          <Text style={styles.label}>Genre: <Text style={styles.value}>{details.genre.join(', ')}</Text></Text>
        </View>
      </View>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.description}>{details.description}</Text>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonLeft, selectedStatus === 'Watched' && styles.selectedButton]}
          onPress={() => handleStatusChange('Watched')}
        >
          {selectedStatus === 'Watched' && <Icon name="check" size={16} color="#666175" />}
          <Text style={styles.actionText}>Watch</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonRight, selectedStatus === 'To Watch' && styles.selectedButton]}
          onPress={() => handleStatusChange('To Watch')}
        >
          {selectedStatus === 'To Watch' && <Icon name="check" size={16} color="#666175" />}
          <Text style={styles.actionText}>To Watch</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  image: {
    width: 125,
    height: 125,
    borderRadius: 10,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  value: {
    fontWeight: 'normal',
    color: '#007bff',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonLeft: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  buttonRight: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  selectedButton: {
    backgroundColor: '#e6dcf5',
  },
  actionText: {
    color: 'black',
    marginLeft: 5,
  },
});

export default DetailsScreen;