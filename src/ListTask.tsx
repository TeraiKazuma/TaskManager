import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  ScrollView,
  // FlatList  // ← FlatListを使う場合は残す
} from 'react-native'
import axios from 'axios'
import dayjs from 'dayjs'
import { CalendarList, LocaleConfig } from 'react-native-calendars'
import { Task } from './components/Task'
import { CalendarItem } from './components/CalendarItem'
import { CalendarDayItem } from './components/CalendarDayItem'
import BACKEND_URL from '../utils/config'

const ListTask: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [eventItems, setEventItems] = useState<Map<string, CalendarItem[]>>(
    new Map()
  )

  useEffect(() => {
    fetchTasks()
  }, [])

  // -----------------------
  // Pythonサーバーからタスク一覧をGET
  // -----------------------
  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(`${BACKEND_URL}/task_list`)
      const tasks = response.data
      setTaskList(tasks)

      // タスク一覧をカレンダー用のイベントバーMapに変換
      const mapData = createEventItems(tasks)
      setEventItems(mapData)
    } catch (error) {
      console.error('タスク取得エラー: ', error)
    }
  }

  // モーダルを開く/閉じる
  const openModal = (task: Task) => {
    setSelectedTask(task)
    setIsModalVisible(true)
  }
  const closeModal = () => {
    setSelectedTask(null)
    setIsModalVisible(false)
  }

  // -----------------------
  // 日付・時刻表示など
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

  // -----------------------
  // レンダリング
  // -----------------------
  return (
    // ScrollView で全体をラップ
    <ScrollView style={styles.container}>

      {/* タイトル */}
      <Text style={styles.TitleText}>タスク一覧</Text>

      {/* 
        例: FlatList をやめてシンプルにループ表示する。
        もしどうしても FlatList を使いたい場合は
        「外側のScrollViewを無くし → Viewで flex分割 → FlatListに固定height」
        などのレイアウト調整が必要になるケースが多いです。
      */}
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

      {/* 詳細モーダル */}
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
              </>
            )}
            <TouchableOpacity
              onPress={closeModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* カレンダー */}
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
        firstDay={1}
        showSixWeeks={true}
        hideExtraDays={false}
        monthFormat="yyyy年 M月"
        horizontal={true}
        hideArrows={false}
        pagingEnabled={true}
      />

      {/* フッターボタン類 */}
      <View>
        <Button
          title="タスクを追加"
          onPress={() => navigation.navigate('AddTask')}
        />
        <Button
          title="ホーム"
          onPress={() => navigation.navigate('Home')}
        />
      </View>

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
  // カレンダーの不要な余白を消すために marginTop: 0 などを指定
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
})

export default ListTask
