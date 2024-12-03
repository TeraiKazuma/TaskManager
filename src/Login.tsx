import React, { useState } from 'react'
import BACKEND_URL from './config'
import {
    View,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    Platform,
    Button,
    Alert,
} from 'react-native'


const Login = ({navigation} :any) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('エラー', 'ユーザー名とパスワードを入力してください')
            return
        }
        try {
            const response = await fetch(`${BACKEND_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (response.ok) {
                Alert.alert('ログイン成功', data.message)
                navigation.navigate('Home') // ログイン成功時にHome画面に遷移
            } else {
                Alert.alert('ログイン失敗', data.message || 'ユーザー名またはパスワードが間違っています。')
            }
        } catch (error) {
            console.error(error)
            Alert.alert('エラー', 'サーバーに接続できませんでした。')
        }
    }

    return(
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
                <View style={styles.inner}>
                    <Text style={styles.header}>ログイン</Text>
                    <TextInput
                        placeholder="ユーザー名"
                        style={styles.textInput}
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        placeholder="パスワード"
                        secureTextEntry
                        style={styles.textInput}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <View style={styles.btnContainer}>
                        <Button title="ログイン" onPress={handleLogin} />
                        <Button title="新規登録" onPress={() => navigation.navigate('Signup')} />
                    </View>
                </View>
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