import React from 'react'
import { View, Button, StyleSheet  } from 'react-native'
import { removeToken } from '../utils/auth'

type HomeProps = {
    navigation: any;
  };

const Home: React.FC<HomeProps> = ({navigation} :any)=>{
    const handleLogout = async () => {
        await removeToken() // トークンを削除
        navigation.replace('Login')// ログイン画面に戻る
    }
    return(
        <View style={styles.container}>
            <Button title="タスクを追加" onPress={() => navigation.navigate('AddTask')}></Button>
            <Button title="タスク一覧" onPress={() => navigation.navigate('ListTask')}></Button>
            <Button title="設定" onPress={() => navigation.navigate('Setting')}></Button>
            <Button title="テスト" onPress={() => navigation.navigate('Test')}></Button>
            <Button title="ログアウト" onPress={handleLogout} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
})  
export default Home