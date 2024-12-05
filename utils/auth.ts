import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * トークンを保存する関数
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('authToken', token)
  } catch (error) {
    console.error('トークンの保存中にエラーが発生しました:', error)
  }
}

/**
 * トークンを取得する関数
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken')
  } catch (error) {
    console.error('トークンの取得中にエラーが発生しました:', error)
    return null
  }
}

/**
 * トークンを削除する関数
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken')
  } catch (error) {
    console.error('トークンの削除中にエラーが発生しました:', error)
  }
}