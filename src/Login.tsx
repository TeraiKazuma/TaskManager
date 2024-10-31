import { View, Text, StyleSheet, Button } from 'react-native';
type RootStackParamList = {
    Login: undefined;
    Home: undefined;  // Homeがここに定義されていることを確認
    };

const Login = ({navigation} :any) => {
    return(
        <View>
            <Button title="ログイン" onPress={() => navigation.navigate('Home')} />
            <Button title="新規登録" onPress={() => navigation.navigate('Signup')} />
        </View>
    )
}

export default Login;