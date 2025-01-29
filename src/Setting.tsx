// Setting.tsx
// 設定画面
import { View, Button } from 'react-native'
import { removeToken } from '../utils/auth'

const Setting = ({navigation} :any)=>{
    const handleLogout = async () => {
        await removeToken() // トークンを削除
        navigation.replace('Login')// ログイン画面に戻る
    }
    return(
        <View>
            <Button title="ログアウト" onPress={handleLogout} />
        </View>

    )
}

export default Setting
