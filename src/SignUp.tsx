// SignUp.tsx
// 新規登録画面
// ユーザー名とパスワードを入力し、サーバーに送信する
// 成功すればログイン画面へ遷移

import React, { useState } from 'react'
import BACKEND_URL from '../utils/config'
import {View,KeyboardAvoidingView,TextInput,StyleSheet,Text,Platform,Button,Alert
} from 'react-native'

const Signup = ({navigation} :any) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // 登録ボタンクリック時
    const handleSignup = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/Signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
    
            if (response.ok) {
                const result = await response.json()
                Alert.alert('成功', result.message)
                navigation.navigate('Login')// ログイン画面に遷移
            } else {
                const error = await response.json()
                Alert.alert('エラー', error.message || '登録に失敗しました')
            }
        } catch (error) {
            console.error(error)
            Alert.alert('エラー', 'サーバーに接続できませんでした')
        }
    }
    return(
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.header}>新規登録</Text>
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
                    <Button title="新規登録" onPress={handleSignup} />
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

export default Signup
