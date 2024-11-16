import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import AppBar from './src/component/AppBar';
import BottomBar from './src/component/BottomBar';

const MyListScreen = ({ navigation }) => {
  const [myList, setMyList] = useState({ "To Watch": [], "Watched": [] });

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

  const groupIntoRows = (list, itemsPerRow) => {
    const rows = [];
    for (let i = 0; i < list.length; i += itemsPerRow) {
      rows.push(list.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image source={{ uri: item.poster_url }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDate}>{item.updatedAt}</Text>
    </View>
  );

  const renderRow = ({ item }) => (
    <FlatList
      data={item}
      renderItem={renderCard}
      keyExtractor={(movie) => movie.movieId.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    />
  );

  const renderSection = ({ item }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{item.title}</Text>
      <FlatList
        data={groupIntoRows(item.data, 7)}
        renderItem={renderRow}
        keyExtractor={(row, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const sections = [
    { title: 'Watched', data: myList.Watched },
    { title: 'To Watch', data: myList["To Watch"] },
  ];

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <AppBar />
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
      <BottomBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  row: {
    marginBottom: 10,
  },
  cardContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cardTitle: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: 'black'
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    paddingVertical: 10,
  },
});

export default MyListScreen;