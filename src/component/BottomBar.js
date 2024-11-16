import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

const BottomBar = ({ navigation }) => {
  const [selected, setSelected] = useState('Home');

  useFocusEffect(
    React.useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setSelected(routeName);
    }, [navigation])
  );

  const handlePress = (screen) => {
    setSelected(screen);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.item, selected === 'Home']} onPress={() => handlePress('Home')}>
        <View style={[styles.iconContainer, selected === 'Home' && styles.selectedIconContainer]}>
          <Icon name="home" size={16} color={'black'} />
          <Text style={[styles.text, selected === 'Home' && styles.selectedText]}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.item, selected === 'MyList']} onPress={() => handlePress('MyList')}>
        <View style={[styles.iconContainer, selected === 'MyList' && styles.selectedIconContainer]}>
          <Icon name="list" size={16} color={'black'} />
          <Text style={[styles.text, selected === 'MyList' && styles.selectedText]}>My List</Text>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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