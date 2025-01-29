// ListTask.tsx
// 登録したタスクの一覧表示を行う画面

import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Linking,
  Platform
} from 'react-native'
import axios from 'axios'
import { Task } from './components/Task'
import BACKEND_URL from '../utils/config'
import { getToken } from '../utils/auth'

const ListTask: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  // 初期表示時にタスク一覧を取得
  useEffect(() => {
    fetchTasks()
  }, [])

  // サーバーからタスク一覧を取得
  const fetchTasks = async () => {
    try {
      const token = await getToken() // トークンを取得
      if (!token) {
        console.error('認証トークンが取得できませんでした')
        return
      }
  
      const response = await axios.get<Task[]>(`${BACKEND_URL}/task_list`, {
        headers: {
          Authorization: `Bearer ${token}`, // トークンを送信
        },
      })
  
      const tasks = response.data
      setTaskList(tasks)
    } catch (error) {
      console.error('タスク取得エラー: ', error)
    }
  }

  // タスク削除処理
  const deleteTask = async (id: number | undefined) => {
    try {
      // 削除確認ダイアログ
      const confirmDelete = Platform.OS === 'web'
        ? window.confirm('このタスクを削除しますか？')
        : await new Promise((resolve) => {
            Alert.alert(
              '確認',
              'このタスクを削除しますか？',
              [
                { text: 'キャンセル', onPress: () => resolve(false) },
                { text: '削除', onPress: () => resolve(true) },
              ],
              { cancelable: true }
            )
          })
  
      if (!confirmDelete) return
  
      // トークン取得
      const token = await getToken()
      const response = await fetch(`${BACKEND_URL}/delete_task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: id }),
      })
  
      const data = await response.json()
      if (response.ok) {
        // タスクリストを更新（削除したものを除外）
        setTaskList((prevTaskList) => {
          return prevTaskList.filter((task) => task.id !== id)
        })
  
        // 削除成功メッセージ
        if (Platform.OS === 'web') {
          window.alert('削除されました: ' + data.message)
        } else {
          Alert.alert('削除されました', data.message)
        }
  
        closeModal()
      } else {
        // 削除失敗メッセージ
        if (Platform.OS === 'web') {
          window.alert('削除できませんでした: ' + data.message)
        } else {
          Alert.alert('削除できませんでした', data.message)
        }
      }
    } catch (error) {
      console.error(error)
      Alert.alert('エラー', 'サーバーに接続できませんでした。')
    }
  }

  // モーダルの開閉
  const openModal = (task: Task) => {
    setSelectedTask(task)
    setIsModalVisible(true)
  }
  const closeModal = () => {
    setSelectedTask(null)
    setIsModalVisible(false)
  }

  // -----------------------
  // 日付・時刻表示
  // -----------------------
  const getNoticeTimeLabel = (notice: number): string => {
    if (notice < 60) {
      const minutes = notice
      return `${minutes} 分前`
    } else if (notice < 1440) {
      const hour = notice / 60
      return `${hour} 時間前`
    } else {
      const days = notice / 1440
      return `${days} 日前`
    }
  }

  const getDate = (startDate: string, endDate: string): string => {
    if (startDate === endDate) {
      return startDate
    }
    return `${startDate} - ${endDate}`
  }

  const getTime = (startTime: string, endTime: string): string => {
    if (startTime === endTime) {
      return startTime
    }
    return `${startTime} - ${endTime}`
  }

  // -----------------------
  // レンダリング
  // -----------------------
  return (
    <View style={styles.container}>
      {/* タイトルエリアを少し装飾 */}
      <View style={styles.headerContainer}>
        <Text style={styles.TitleText}>タスク一覧</Text>
      </View>

      <ScrollView style={styles.scrollInner}>
        {/* タスク一覧表示 */}
        {taskList.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.selectBox}
            onPress={() => openModal(item)}
          >
            <Text style={styles.taskTitle}>
              {item.title}
            </Text>
            <Text style={styles.taskDetail}>
              種類: {item.kind}
            </Text>
            <Text style={styles.taskDetail}>
              日付: {item.enddate}
            </Text>
            <Text style={styles.taskDetail}>
              時刻: {item.starttime}
            </Text>
            <Text style={styles.taskDetail}>
              場所: {item.place}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 詳細表示モーダル */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>予定詳細</Text>
            {selectedTask && (
              <>
                <Text style={styles.optionText}>
                  タイトル: {selectedTask.title}
                </Text>
                <Text style={styles.optionText}>
                  種類: {selectedTask.kind}
                </Text>
                <Text style={styles.optionText}>
                  日付: {getDate(selectedTask.startdate, selectedTask.enddate)}
                </Text>
                <Text style={styles.optionText}>
                  時刻: {getTime(selectedTask.starttime, selectedTask.endtime)}
                </Text>
                <Text style={styles.optionText}>
                  通知時刻: {getNoticeTimeLabel(selectedTask.notice)}
                </Text>
                <Text style={styles.optionText}>
                  場所: {selectedTask.place}
                </Text>
                {/* URL */}
                {selectedTask.url ? (
                  <TouchableOpacity
                  onPress={() => {
                    if (selectedTask.url) {
                      Linking.openURL(selectedTask.url).catch(err =>
                        console.error("Failed to open URL:", err)
                      )
                    }
                  }}
                >
                  <Text style={styles.optionText}>URL:</Text>
                  <Text style={[styles.optionText, styles.linkText]}>
                    {selectedTask.url}
                  </Text>
                </TouchableOpacity>
                ) : null}
                <Text style={styles.optionText}>
                  メモ: {selectedTask.memo}
                </Text>
              </>
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => deleteTask(selectedTask?.id)}
                style={[styles.closeButton, { backgroundColor: '#f08080' }]}
              >
                <Text style={styles.closeButtonText}>削除</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeModal}
                style={[styles.closeButton, { backgroundColor: '#999' }]}
              >
                <Text style={styles.closeButtonText}>閉じる</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  headerContainer: {
    backgroundColor: '#87CEEB',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  TitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollInner: {
    flex: 1,
  },
  selectBox: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    // カードっぽい影
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2, // Android用
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  taskDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    // カードっぽい影
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android用
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  optionText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'flex-end',
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
})

export default ListTask
