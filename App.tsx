import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { View, Text, ActivityIndicator } from 'react-native'
import { getToken } from './utils/auth'
import Login from './src/Login'
import Signup from './src/SignUp'
import Home from './src/Home'
import AddTask from './src/AddTask'
import ListTask from './src/ListTask'
import Setting from './src/Setting'
import Test from './src/test'

const Stack = createStackNavigator()

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // ログイン状態を管理
  const [loading, setLoading] = useState(true) // 初期読み込み状態

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getToken()
        console.log('取得したトークン:', token) // デバッグ用ログ
        setIsLoggedIn(!!token)
      } catch (error) {
        console.error('ログイン状態確認エラー:', error)
      } finally {
        setLoading(false)
      }
    }
    checkLoginStatus()
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>読み込み中...</Text>
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
        <Stack.Screen name="Login">
          {(props) => (
            <Login
              {...props}
              setIsLoggedIn={setIsLoggedIn}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Signup" component={Signup} options={{ title: '新規登録' }} />
        <Stack.Screen name="Home" component={Home} options={{ title: 'ホーム' }} />
        <Stack.Screen name="AddTask" component={AddTask} options={{ title: 'タスクを追加' }} />
        <Stack.Screen name="ListTask" component={ListTask} options={{ title: 'タスク一覧' }} />
        <Stack.Screen name="Setting" component={Setting} options={{ title: '設定' }} />
        <Stack.Screen name="Test" component={Test} options={{ title: 'テスト' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
