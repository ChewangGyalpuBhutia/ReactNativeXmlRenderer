import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppBar from './src/component/AppBar';
import BottomBar from './src/component/BottomBar';

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [isGridLayout, setIsGridLayout] = useState(false);

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

  const handleSort = () => {
    const sortedMovies = [...movies].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setMovies(sortedMovies);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilter = (type) => {
    setFilterType(type);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMovies();
    setRefreshing(false);
  };

  const toggleLayout = () => {
    setIsGridLayout(!isGridLayout);
  };

  const filteredMovies = movies
    .filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((movie) => filterType === 'all' || movie.type === filterType);

  const renderListCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { id: item.id })}>
      <View style={styles.listCardContainer}>
        <Image source={{ uri: item.poster_url }} style={styles.listCardImage} />
        <View style={styles.listCardContent}>
          <Text style={styles.listCardTitle}>{item.title}</Text>
          <Text style={styles.listCardDescription}>{item.Description}</Text>
          <View style={styles.listCardTypeContainer}>
            <Text style={styles.listCardType}>{item.type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGridCard = ({ item }) => (
    <TouchableOpacity style={{ flex: 1, }}
      onPress={() => navigation.navigate('Details', { id: item.id })}>
      <View style={styles.gridCardContainer}>
        <Image source={{ uri: item.poster_url }} style={styles.gridCardImage} />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8
        }}>
          <Text style={styles.gridCardTitle}>{item.title}</Text>
          {/* <Text style={styles.listCardDescription}>{item.Description}</Text> */}
          <View style={styles.listCardTypeContainer}>
            <Text style={styles.listCardType}>{item.type}</Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <AppBar />
      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Movies/Shows/Genre"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSort}>
            <Icon name="sort" size={16} color="black" />
            <Text style={styles.actionText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleFilter('movie')}>
            <Icon name="film" size={16} color="black" />
            <Text style={styles.actionText}>Movies</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleFilter('show')}>
            <Icon name="tv" size={16} color="black" />
            <Text style={styles.actionText}>TV Shows</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleFilter('all')}>
            <Icon name="list" size={16} color="black" />
            <Text style={styles.actionText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={toggleLayout}>
            <Icon name={isGridLayout ? 'th-list' : 'th-large'} size={16} color="black" />
            <Text style={styles.actionText}>{isGridLayout ? 'List View' : 'Grid View'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredMovies}
          renderItem={isGridLayout ? renderGridCard : renderListCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          numColumns={isGridLayout ? 2 : 1}
          key={isGridLayout ? 'g' : 'l'} // Add a key to force re-render when layout changes
        />
      </View>
      <BottomBar navigation={navigation} />
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
    color: '#666',
  },
  actionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 13,
    color: 'black',
  },
  listCardContainer: {
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
  gridCardContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  listCardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  gridCardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  listCardContent: {
    flex: 1,
    marginLeft: 10,
  },
  listCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black'
  },
  gridCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'black'
  },
  listCardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  listCardTypeContainer: {
    borderRadius: 5,
    padding: 4,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666',
  },
  listCardType: {
    fontSize: 12,
    color: 'black'
  },
});

export default HomeScreen;