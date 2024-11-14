import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const MyListScreen = () => {
  const [myList, setMyList] = useState([]);
  const [tab, setTab] = useState('To Watch');

  useEffect(() => {
    fetchMyList();
  }, []);

  const fetchMyList = async () => {
    try {
      const response = await fetch('https://api.rapidmock.com/api/vikuman/v1/mylist');
      const data = await response.json();
      setMyList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredList = myList.filter(item => item.status === tab);

  return (
    <View>
      <TouchableOpacity onPress={() => setTab('To Watch')}>
        <Text>To Watch</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setTab('Watched')}>
        <Text>Watched</Text>
      </TouchableOpacity>
      <FlatList
        horizontal
        data={filteredList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default MyListScreen;