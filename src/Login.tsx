import {
    View,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    Platform,
    TouchableWithoutFeedback,
    Button,
    Keyboard,
} from 'react-native'


const Login = ({navigation} :any) => {
    
    return(
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                <Text style={styles.header}>ログイン</Text>
                <TextInput placeholder="ユーザー名" style={styles.textInput} />
                <TextInput 
                placeholder="パスワード" 
                secureTextEntry
                style={styles.textInput} />
                <View style={styles.btnContainer}>
                    <Button title="ログイン" onPress={() => navigation.navigate('Home')} />
                    <Button title="新規登録" onPress={() => navigation.navigate('Signup')} />
                </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: 'space-around',
    },
    header: {
        fontSize: 36,
        marginBottom: 0,
    },
    textInput: {
        height: 40,
        borderColor: '#000000',
        borderBottomWidth: 1
    },
    btnContainer: {
        backgroundColor: 'white',
        marginTop: 12,
    },
})

export default Login