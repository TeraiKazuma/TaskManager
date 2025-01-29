// auth.ts
// トークンの永続化に AsyncStorage を使うためのラッパ関数たち。
// 他の画面でトークン保存・取得・削除処理をまとめて呼び出せるようにしている。

// auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import {jwtDecode} from 'jwt-decode'

//トークンを保存
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('authToken', token)
  } catch (error) {
    console.error('トークンの保存中にエラーが発生しました:', error)
  }
}

//トークンを取得
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken')
  } catch (error) {
    console.error('トークンの取得中にエラーが発生しました:', error)
    return null
  }
}

//トークンを削除
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken')
  } catch (error) {
    console.error('トークンの削除中にエラーが発生しました:', error)
  }
}



interface DecodedToken {
  exp: number // JWT の「有効期限(Unix Time)」
  // 必要に応じて user_id などを定義
}

//トークンの有効期限を確認
export const isTokenValid = async (): Promise<boolean> => {
  try {
    const token = await getToken()
    if (!token) {
      return false
    }
    const decoded = jwtDecode<DecodedToken>(token)
    // 現在時刻(秒)を取得
    const now = Math.floor(Date.now() / 1000)
    // 有効期限切れかどうか判定
    if (decoded.exp < now) {
      // 期限切れ
      return false
    }
    // 期限内
    return true
  } catch (error) {
    console.error('トークンのデコード中にエラー:', error)
    return false
  }
}
