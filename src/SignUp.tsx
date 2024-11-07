import { View, Button } from 'react-native'
const Signup = ({navigation}: any) => {
    return(
        <View>
            <Button title="新規登録" onPress={() => navigation.navigate('Login')}></Button>
        </View>
    )
}

export default Signup