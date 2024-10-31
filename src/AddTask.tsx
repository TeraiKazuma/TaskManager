import { View, Text, StyleSheet, Button } from 'react-native';
const AddTask = ({navigation} :any)=>{
    return(
        <View>
            <Button title="タスクを追加" onPress={() => navigation.navigate('ListTask')}></Button>
        </View>
    )
}

export default AddTask;