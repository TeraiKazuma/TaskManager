// ListTask.tsx
// 登録したタスクの一覧・カレンダー表示を行う画面

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
import dayjs from 'dayjs'
import { CalendarList, LocaleConfig } from 'react-native-calendars'
import { Task } from './components/Task'
import { CalendarItem } from './components/CalendarItem'
import { CalendarDayItem } from './components/CalendarDayItem'
import BACKEND_URL from '../utils/config'
import { getToken } from '../utils/auth'

const ListTask: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [eventItems, setEventItems] = useState<Map<string, CalendarItem[]>>(
    new Map()
  )

  // 初期表示時にタスク一覧を取得
  useEffect(() => {
    fetchTasks()
  }, [])

  // サーバーからタスク一覧を取得
  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(`${BACKEND_URL}/task_list`)
      const tasks = response.data
      setTaskList(tasks)

      // タスク一覧をカレンダー用のタスクバーMapに変換
      const mapData = createEventItems(tasks)
      setEventItems(mapData)
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
          const updatedTaskList = prevTaskList.filter((task) => task.id !== id)
          // カレンダーのイベント用Mapを再生成
          const updatedEventItems = createEventItems(updatedTaskList)
          setEventItems(updatedEventItems)
          return updatedTaskList
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
      const hour = notice/60
      return `${hour} 時間前`
    } else {
      const days = notice /1440
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
  // Task[] → eventItems(Map) に変換
  // -----------------------
  const createEventItems = (tasks: Task[]): Map<string, CalendarItem[]> => {
    const result = new Map<string, CalendarItem[]>()

    tasks.forEach((task) => {
      const start = dayjs(task.startdate)
      const end = dayjs(task.enddate)
      const color = '#87CEEB'
      const diffDays = end.diff(start, 'day') + 1

      if (diffDays <= 1) {
        // 同一日
        const key = start.format('YYYY-MM-DD')
        const arr = result.get(key) ?? []
        const newIndex = arr.length

        arr.push({
          id: String(task.id),
          index: newIndex,
          color,
          text: task.title,
          type: 'all',
        })
        result.set(key, arr)
      } else {
        // 複数日にまたがる場合
        let fixedIndex: number | null = null
        for (let i = 0; i < diffDays; i++) {
          const currentDay = start.add(i, 'day')
          const key = currentDay.format('YYYY-MM-DD')
          const arr = result.get(key) ?? []

          if (fixedIndex === null) {
            fixedIndex = arr.length
          }

          let eventType: CalendarItem['type'] = 'between'
          if (i === 0) {
            eventType = 'start'
          } else if (i === diffDays - 1) {
            eventType = 'end'
          }

          arr.push({
            id: String(task.id),
            index: fixedIndex,
            color,
            text: task.title,
            type: eventType,
          })
          result.set(key, arr)
        }
      }
    })

    return result
  }

  // -----------------------
  // カレンダーの日本語設定
  // -----------------------
  LocaleConfig.locales.jp = {
    monthNames: [
      '1月','2月','3月','4月','5月','6月',
      '7月','8月','9月','10月','11月','12月'
    ],
    monthNamesShort: [
      '1月','2月','3月','4月','5月','6月',
      '7月','8月','9月','10月','11月','12月'
    ],
    dayNames: [
      '日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'
    ],
    dayNamesShort: ['日','月','火','水','木','金','土'],
  }
  LocaleConfig.defaultLocale = 'jp'

  // -----------------------
  // レンダリング
  // -----------------------
  return (
    // ScrollView で全体をラップ
    <ScrollView style={styles.container}>

      {/* タイトル */}
      <Text style={styles.TitleText}>タスク一覧</Text>

      {/* タスク一覧表示 */}
      {taskList.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.selectBox}
          onPress={() => openModal(item)}
        >
          <Text>
            {item.title} {item.kind}{'\n'}
            {item.enddate} {item.starttime} {item.place}
          </Text>
        </TouchableOpacity>
      ))}

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
                <TouchableOpacity
                  onPress={() => {
                    if (selectedTask.url) {
                      Linking.openURL(selectedTask.url).catch(err =>
                        console.error("Failed to open URL:", err)
                      )
                    }
                  }}
                >
                  <Text style={styles.optionText}>
                    URL:
                  </Text>
                  <Text style={[styles.optionText, styles.linkText]}>
                    {selectedTask.url}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              onPress={ ( ) => deleteTask(selectedTask?.id) } 
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>削除</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* カレンダー表示 (horizontalスワイプ可) */}
      <CalendarList
        style={styles.calendar}
        dayComponent={(dayProps) => (
          <CalendarDayItem
            {...dayProps}
            eventItems={eventItems}
            cellMinHeight={80}
          />
        )}
        pastScrollRange={12}
        futureScrollRange={12}
        firstDay={1}             // 週の開始を月曜日に
        showSixWeeks={true}
        hideExtraDays={false}
        monthFormat="yyyy年 M月"
        horizontal={true}
        hideArrows={false}
        pagingEnabled={true}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TitleText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10
  },
  selectBox: {
    margin: 12,
    minHeight: 40,
    justifyContent: 'center',
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#f0f0f0',
  },
  calendar: {
    marginTop: 0,
    paddingTop: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'black',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
})

export default ListTask
