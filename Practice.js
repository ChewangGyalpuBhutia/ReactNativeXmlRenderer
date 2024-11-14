import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Button} from 'react-native';

const Practice = () => {
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch('https://api.example.com/data');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [value, setValue]= useState(null)
    const inputRef = useRef(null);
    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            setValue("jlkdf")
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Text>About Screen</Text>
            {data && <Text>{JSON.stringify(data)}</Text>}
            <TextInput
                ref={inputRef}
                style={styles.input}
                value={value}
                placeholder="Type something here..."
            />
            <Button title="Focus Input" onPress={focusInput} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 25,
        paddingBottom: 20,
        backgroundColor: 'white',
    },
});

export default Practice;