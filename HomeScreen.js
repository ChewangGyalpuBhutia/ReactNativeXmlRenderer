import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('https://api.rapidmock.com/api/vikuman/v1/movies/all');
      const data = await response.json();
      setMovies(data);
      setFilteredMovies(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = movies.filter(movie => movie.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredMovies(filtered);
  };

  const handleSort = () => {
    const sorted = [...filteredMovies].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setFilteredMovies(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilter = (type) => {
    setFilterType(type);
    if (type === 'all') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => movie.type === type);
      setFilteredMovies(filtered);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <Button title="Sort Alphabetically" onPress={handleSort} />
      <Button title="Filter Movies" onPress={() => handleFilter('movie')} />
      <Button title="Filter Shows" onPress={() => handleFilter('show')} />
      <Button title="Show All" onPress={() => handleFilter('all')} />
      <TouchableOpacity onPress={() => alert('Hamburger Menu Clicked')}>
        <Text>Hamburger Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text>Profile Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MyList')}>
        <Text>My List</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Details', { id: item.id })}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;