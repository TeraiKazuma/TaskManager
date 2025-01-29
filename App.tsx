// App.tsx
// ReactNavigationを使った画面遷移やタブ設定を行うメインコンポーネント

import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// トークン関連の関数
import { isTokenValid, removeToken } from './utils/auth'

// 各画面をインポート
import Login from './src/Login'
import Signup from './src/SignUp'
import Home from './src/Home'
import AddTask from './src/AddTask'
import ListTask from './src/ListTask'
import Setting from './src/Setting'
import test from './src/test'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse'
          switch (route.name) {
            case 'Home':
              iconName = 'home'
              break
            case 'AddTask':
              iconName = 'add-circle'
              break
            case 'ListTask':
              iconName = 'list'
              break
            case 'Setting':
              iconName = 'settings'
              break
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="AddTask" component={AddTask} />
      <Tab.Screen name="ListTask" component={ListTask} />
      <Tab.Screen name="Setting" component={Setting} />
      <Tab.Screen name="test" component={test} />
    </Tab.Navigator>
  )
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // トークンが有効期限内ならログイン扱い。ダメならトークンを消してログイン画面へ。
        if (await isTokenValid()) {
          setIsLoggedIn(true)
        } else {
          await removeToken()
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('ログインチェック中エラー:', error)
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }
    checkLoginStatus()
  }, [])

  // ローディング中のインジケータ
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>読み込み中...</Text>
      </View>
    )
  }

  // ログイン状態に応じて最初に表示するスタックを切り替える
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'MainTabs' : 'Login'}>
        <Stack.Screen name="Login">
          {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Signup" component={Signup} options={{ title: '新規登録' }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
