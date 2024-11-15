import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

const AppBar = ({ navigation }) => {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            display: 'flex',
            justifyContent: 'space-between',
        }}>
            <TouchableOpacity onPress={() => alert('Hamburger Menu Clicked')}>
                <Icon name="bars" size={30} color="black" solid />
            </TouchableOpacity>
            <Text style={{ color: 'black', marginLeft: 10, fontSize: 16 }}>Cinemas</Text>
            <TouchableOpacity onPress={() => alert('Profile Icon Clicked')}>
                <Entypo name="user" size={30} color="black" />
            </TouchableOpacity>
        </View>
    );
};

export default AppBar;