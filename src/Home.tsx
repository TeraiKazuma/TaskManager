import { View, Text, StyleSheet, Button } from 'react-native';
const Home = ({navigation} :any)=>{
    return(
        <View>
            <Button title="タスクを追加" onPress={() => navigation.navigate('AddTask')}></Button>
            <Button title="タスク一覧" onPress={() => navigation.navigate('ListTask')}></Button>
            <Button title="設定" onPress={() => navigation.navigate('Setting')}></Button>
        </View>
    )
}

export default Home;