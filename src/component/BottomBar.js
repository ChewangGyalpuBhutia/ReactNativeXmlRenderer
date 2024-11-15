import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BottomBar = ({ navigation }) => {
  const [selected, setSelected] = useState('Home');

  const handlePress = (screen) => {
    setSelected(screen);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.item, selected === 'Home' && styles.selectedItem]}
        onPress={() => handlePress('Home')}
      >
        <View style={[styles.iconContainer, selected === 'Home' && styles.selectedIconContainer]}>
          <Icon name="home" size={16} color={'balck'} />
          <Text style={styles.text}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item, selected === 'MyList' && styles.selectedItem]}
        onPress={() => handlePress('MyList')}
      >
        <View style={[styles.iconContainer, selected === 'MyList' && styles.selectedIconContainer]}>
          <Icon name="list" size={16} color={'black'} />
          <Text style={styles.text}>My List</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
  },
  selectedIconContainer: {
    backgroundColor: '#e6dcf5',
  },
  text: {
    color: 'black',
    fontSize: 14,
  },
  selectedText: {
    color: 'black',
  },
});

export default BottomBar;