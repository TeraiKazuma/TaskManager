import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Linking,
  Platform,
  ScrollView,
  TextInput
} from 'react-native'
import axios from 'axios'
import dayjs from 'dayjs'
import { CalendarList, LocaleConfig } from 'react-native-calendars'
import { Task } from './components/Task'
import { CalendarItem } from './components/CalendarItem'
import { CalendarDayItem } from './components/CalendarDayItem'
import BACKEND_URL from '../utils/config'
import { getToken } from '../utils/auth'

// ---- Setting.tsx などで管理されている色を読み込む想定 ----
const kindColors: Record<string, string> = {
  schedule: '#87CEEB',
  task: '#FFA07A',
  event: '#90EE90',
  // 他にも種類があれば追加
}

// タスクの種類に応じて色を取得する関数
const getTaskColor = (kind: string): string => {
  return kindColors[kind] || '#87CEEB'
}

const Home: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [eventItems, setEventItems] = useState<Map<string, CalendarItem[]>>(new Map())

  // --- 検索用 ---
  const [searchText, setSearchText] = useState('')
  // ボタンが押されたら true にするフラグ
  const [isSearched, setIsSearched] = useState(false)

  // 初回表示時にタスク一覧を取得
  useEffect(() => {
    fetchTasks()
  }, [])

  // サーバーからタスク一覧を取得
  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(`${BACKEND_URL}/task_list`)
      const tasks = response.data
      setTaskList(tasks)

      // カレンダー用イベントデータに変換
      const mapData = createEventItems(tasks)
      setEventItems(mapData)
    } catch (error) {
      console.error('タスク取得エラー: ', error)
    }
  }

  // タスク削除
  const deleteTask = async (id: number | undefined) => {
    try {
      const confirmDelete =
        Platform.OS === 'web'
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
        setTaskList((prevTaskList) => {
          const updatedTaskList = prevTaskList.filter((task) => task.id !== id)
          const updatedEventItems = createEventItems(updatedTaskList)
          setEventItems(updatedEventItems)
          return updatedTaskList
        })

        if (Platform.OS === 'web') {
          window.alert('削除されました: ' + data.message)
        } else {
          Alert.alert('削除されました', data.message)
        }

        closeModal()
      } else {
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
  // 日付・時刻表示系
  // -----------------------
  const getNoticeTimeLabel = (notice: number): string => {
    if (notice < 60) {
      return `${notice} 分前`
    } else if (notice < 1440) {
      const hour = notice / 60
      return `${hour} 時間前`
    } else {
      const days = notice / 1440
      return `${days} 日前`
    }
  }

  const getDate = (startDate: string, endDate: string): string => {
    if (startDate === endDate) return startDate
    return `${startDate} - ${endDate}`
  }

  const getTime = (startTime: string, endTime: string): string => {
    if (startTime === endTime) return startTime
    return `${startTime} - ${endTime}`
  }

  // -----------------------
  // Task[] → eventItems(Map)
  // カレンダーに表示するためのデータ変換
  // -----------------------
  const createEventItems = (tasks: Task[]): Map<string, CalendarItem[]> => {
    const result = new Map<string, CalendarItem[]>()

    tasks.forEach((task) => {
      const start = dayjs(task.startdate)
      const end = dayjs(task.enddate)
      // 種類に応じた色を取得
      const color = getTaskColor(task.kind)
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
        // 複数日にまたがる
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

  // タスク一覧(開始日時順)
  const sortedTasks = [...taskList].sort(
    (a, b) => dayjs(a.startdate).valueOf() - dayjs(b.startdate).valueOf()
  )

  // --- 検索ロジック ---
  // ここではタイトル＆種類に絞って検索
  const matchedTasks = sortedTasks.filter((task) => {
    const lowerSearch = searchText.toLowerCase()
    return (
      task.title?.toLowerCase().includes(lowerSearch) ||
      task.kind?.toLowerCase().includes(lowerSearch)
    )
  })

  // 検索ボタンクリック時
  const handleSearch = () => {
    // 検索ボタンが押されたことを示す
    setIsSearched(true)
  }

  return (
    <ScrollView style={styles.mainContainer}>
      {/* 上段：左(検索), 右(タスクリスト5件) */}
      <View style={styles.topContainer}>
        {/* 左：検索エリア */}
        <View style={styles.leftBox}>
          <Text style={styles.searchLabel}>タスク検索</Text>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="キーワードを入力..."
          />

          {/* 検索ボタン */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>検索</Text>
          </TouchableOpacity>

          {/* 検索結果(最大3件) */}
          {isSearched && (
            matchedTasks.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.taskItem}
                onPress={() => openModal(item)}
              >
                <Text style={styles.taskItemText}>
                  {item.title} / {item.kind}{'\n'}
                  {item.startdate} ~ {item.enddate}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* 右：タスクリスト(近日順) - 最大5件 */}
        <View style={styles.rightBox}>
          <Text style={styles.subTitleText}>タスク一覧(近日順)</Text>
          {sortedTasks.slice(0, 5).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.taskItem}
              onPress={() => openModal(item)}
            >
              <Text style={styles.taskItemText}>
                {item.title} / {item.kind}{'\n'}
                {item.startdate} ~ {item.enddate}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 下段：カレンダー */}
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
        firstDay={1} // 週の開始を月曜日に
        showSixWeeks={true}
        hideExtraDays={false}
        monthFormat="yyyy年 M月"
        horizontal={true}
        hideArrows={false}
        pagingEnabled={true}
      />

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
              </>
            )}
            <TouchableOpacity
              onPress={() => deleteTask(selectedTask?.id)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>削除</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

// -----------------------
// スタイル
// -----------------------
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  leftBox: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#87CEEB',
    borderRadius: 5,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  searchButtonText: {
    fontSize: 16,
    color: '#fff',
  },

  rightBox: {
    flex: 1,
    backgroundColor: '#fdf5e6',
    borderRadius: 8,
    padding: 10,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  taskItem: {
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskItemText: {
    fontSize: 14,
    color: '#555',
  },
  calendar: {
    // 下段カレンダー
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
    marginBottom: 4,
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

export default Home
