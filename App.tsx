// App.tsx
// ReactNavigationを使った画面遷移やタブ設定を行うメインコンポーネント

import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, Text, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { getToken } from "./utils/auth"

// 各画面をインポート
import Login from "./src/Login"
import Signup from "./src/SignUp"
import Home from "./src/Home"
import AddTask from "./src/AddTask"
import ListTask from "./src/ListTask"
import Setting from "./src/Setting"
import test from "./src/test"

// ナビゲーション作成
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// メインタブナビゲーション
const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "ellipse"
          switch (route.name) {
            case "Home":
              iconName = "home"
              break
            case "AddTask":
              iconName = "add-circle"
              break
            case "ListTask":
              iconName = "list"
              break
            case "Setting":
              iconName = "settings"
              break
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
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
  // ログイン状態
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // 画面切り替え前のローディング状態
  const [loading, setLoading] = useState(true)

  // アプリ起動時にトークンがあるかどうかチェック
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getToken()
        setIsLoggedIn(!!token)
      } catch (error) {
        console.error("トークン取得エラー:", error)
      } finally {
        setLoading(false)
      }
    }
    checkLoginStatus()
  }, [])

  // ローディング中のインジケータ
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>読み込み中...</Text>
      </View>
    )
  }

  // ログイン状態に応じて最初に表示するスタックを切り替える
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "MainTabs" : "Login"}>
        {/* ログイン画面 */}
        <Stack.Screen name="Login">
          {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        {/* 新規登録画面 */}
        <Stack.Screen name="Signup" component={Signup} options={{ title: "新規登録" }} />
        {/* メインタブ (ホーム, タスク追加, タスク一覧, 設定など) */}
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
