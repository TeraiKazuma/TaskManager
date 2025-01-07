// ListTask.tsx
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import dayjs from 'dayjs'
import { CalendarList, LocaleConfig } from 'react-native-calendars'

// 他ファイルからインポート
import { Task } from './components/Task'
import { CalendarItem } from './components/CalendarItem'
import { CalendarDayItem } from './components/CalendarDayItem'

/**
 * Flaskサーバーの URL
 * （シミュレータ使用時に合わせて '10.0.2.2:5000' などに変更することも）
 */
const BACKEND_URL = 'http://127.0.0.1:5000'

// -----------------------
// メイン画面コンポーネント
// -----------------------
const ListTask: React.FC = () => {
  // 取得したタスク一覧
  const[, setTaskList] = useState<Task[]>([])

  // カレンダーに描画するイベントバー一覧 (日付ごとにまとめたMap)
  const [eventItems, setEventItems] = useState<Map<string, CalendarItem[]>>(
    new Map()
  )

  // マウント時にタスクを取得
  useEffect(() => {
    fetchTasks()
  }, [])

  // -----------------------
  // Pythonサーバーからタスク一覧をGET
  // -----------------------
  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(`${BACKEND_URL}/task_list`)
      const tasks = response.data // [ { id, title, ... }, {...}, ... ]

      setTaskList(tasks)

      // タスク一覧をカレンダー用のイベントバーMapに変換
      const mapData = createEventItems(tasks)
      setEventItems(mapData)

    } catch (error) {
      console.error('タスク取得エラー: ', error)
    }
  }

  // -----------------------
  // Task[] → eventItems(Map) に変換
  // -----------------------
  const createEventItems = (tasks: Task[]): Map<string, CalendarItem[]> => {
    const result = new Map<string, CalendarItem[]>()

    tasks.forEach((task) => {
      // 例: "2025-01-10" → dayjs("2025-01-10")
      const start = dayjs(task.startdate)
      const end   = dayjs(task.enddate)

      // バーの色(例として固定)
      // kind ごとに変えたり、idごとに変えたりしてもOK
      const color = '#87CEEB'

      // 開始日～終了日までの日数
      const diffDays = end.diff(start, 'day') + 1

      if (diffDays <= 1) {
        // 同一日
        const key = start.format('YYYY-MM-DD')
        const arr = result.get(key) ?? []
        const newIndex = arr.length // 同日内の既存件数を index に

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

          // 同じ連続予定は同じ index で縦に並べる
          if (fixedIndex === null) {
            fixedIndex = arr.length
          }

          // 開始日or終了日or中間かで type を分ける
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

  // 日付セルの最低高さ
  const cellMinHeight = 80

  // -----------------------
  // レンダリング
  // -----------------------
  return (
    <View style={{ flex: 1 }}>
      <CalendarList
        // dayComponent に独自コンポーネントを指定し、eventItemsを渡す
        dayComponent={(dayProps) => (
          <CalendarDayItem
            {...dayProps}
            eventItems={eventItems}
            cellMinHeight={cellMinHeight}
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
    </View>
  )
}

export default ListTask