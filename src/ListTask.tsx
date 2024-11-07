import { View, Button } from 'react-native'
const ListTask = ({navigation} :any)=>{
    return(
        <View>
            <Button title="タスクを追加" onPress={() => navigation.navigate('AddTask')}></Button>
            <Button title="ホーム" onPress={() => navigation.navigate('Home')}></Button>
        </View>
    )
}

export default ListTask