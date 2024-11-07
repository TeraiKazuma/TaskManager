import React from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
const AddTask = ({navigation} :any)=>{
    const [text, onChangeText] = React.useState('Useless Text');
    return(
        <View>
            <Text>タイトル</Text>
            <TextInput 
                value={text}
                onChangeText={onChangeText}
                placeholder='タイトル'
                keyboardType="numeric"/>
            <Button title="タスクを追加" onPress={() => navigation.navigate('ListTask')}></Button>
        </View>
    )
}

export default AddTask;