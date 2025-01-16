import React, { useEffect } from 'react'
import { Button, View } from 'react-native'
import * as Notifications from 'expo-notifications'


// アプリ
const App: React.FC = () => {
  // 初期化
  useEffect(() => {
    // パーミッションの要求
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync()
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync()
      }
    }
    requestNotificationPermission()

    // アプリがフォアグラウンドにある場合の通知挙動の設定
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true, // 通知をアラートとして表示
        shouldPlaySound: true, // 通知音の再生
        shouldSetBadge: false, // アプリアイコンのバッジの設定
      }),
    })
  }, [])

  // クリック時に呼ばれる
  const onClick = async () => {
    // ローカルプッシュ通知の作成
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '通知完了',
        body: '3秒後に通知しました。',
      },
      trigger: {
        seconds:3
      },
    })
  }

  // UI
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="3秒後に通知" onPress={onClick} />
    </View>
  )
}

export default App