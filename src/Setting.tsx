// Setting.tsx
// 設定画面
import { View, Button } from 'react-native'

const Setting = ({navigation} :any)=>{
    return(
        <View>
            <Button title="ホーム" onPress={() => navigation.navigate('Home')}/>
            <Button title="テスト" onPress={() => navigation.navigate('test')}/>
        </View>
    )
}

export default Setting
