import React, { useState, useEffect } from 'react';
import { 
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppBar from './src/component/AppBar';
import BottomBar from './src/component/BottomBar';

const HomeScreen = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('https://api.rapidmock.com/api/vikuman/v1/movies/all');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image 
        source={{ uri: item.poster_url }} 
        style={styles.cardImage} 
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>
          {item.Description}
        </Text>
        <View style={styles.cardTypeContainer}>
          <Text style={styles.cardType}>{item.type}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <AppBar />
      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Search Movies/Shows/Genre" placeholderTextColor="#888" />
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="sort" size={20} color="black" />
            <Text style={styles.actionText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="filter" size={20} color="black" />
            <Text style={styles.actionText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={movies}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      </View>
      <BottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
  cardContainer: {
    flexDirection: 'row',
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardTypeContainer: {
    borderRadius: 5,
    padding: 4,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666',
  },
  cardType: {
    fontSize: 12,
  },
});

export default HomeScreen;