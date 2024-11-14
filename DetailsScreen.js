import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [details, setDetails] = useState(null);

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

  const addToList = async (status) => {
    try {
      await fetch('https://api.rapidmock.com/api/vikuman/v1/mylist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId: id, status }),
      });
      alert('Added to list');
    } catch (error) {
      console.error(error);
    }
  };

  if (!details) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>{details.name}</Text>
      <Text>{details.type}</Text>
      <Text>{details.description}</Text>
      <Button title="To Watch" onPress={() => addToList('To Watch')} />
      <Button title="Watched" onPress={() => addToList('Watched')} />
    </View>
  );
};

export default DetailsScreen;