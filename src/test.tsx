import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'

// スケジュールデータ（例: 日をまたぐタスク）
const tasks = [
  {
    startDate: '2024-11-21',
    endDate: '2024-11-22',
    description: '夜勤\n22:00〜06:00',
  },
  {
    startDate: '2024-11-28',
    endDate: '2024-11-28',
    description: 'タスク2\n14:00〜16:00',
  },
  {
    startDate: '2024-12-01',
    endDate: '2024-12-03',
    description: 'イベント3\n終日',
  },
]

// 開始日から終了日までの日付を取得するヘルパー関数
const getDatesInRange = (startDate: string, endDate: string) => {
  const dates = []
  let currentDate = new Date(startDate)
  const lastDate = new Date(endDate)

  while (currentDate <= lastDate) {
    dates.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1) // 次の日に進む
  }

  return dates
}

const CustomCalendar: React.FC = () => {
  // markedDates を生成
  const markedDates = tasks.reduce((acc, task) => {
    const dates = getDatesInRange(task.startDate, task.endDate)

    dates.forEach((date, index) => {
      acc[date] = {
        marked: true,
        dotColor: 'blue',
        customStyles: {
          container: {
            backgroundColor: index === 0 ? '#FFD700' : '#87CEEB', // 開始日と中間日で色分け
          },
          text: {
            color: 'white',
          },
        },
      }
    })

    return acc
  }, {} as Record<string, any>)

  // 各日付セルをカスタマイズ
  const renderDay = ({
    date,
    state,
  }: {
    date: DateData;
    state: string;
  }) => {
    const task = tasks.find(
      (t) =>
        date.dateString >= t.startDate && date.dateString <= t.endDate // 該当タスクを検索
    )

    return (
      <View style={styles.dayContainer}>
        {/* 日付 */}
        <Text
          style={[
            styles.dayText,
            state === 'disabled' && { color: 'gray' }, // 無効な日付の場合はグレー表示
          ]}
        >
          {date.day}
        </Text>
        {/* スケジュール */}
        {task && <Text style={styles.taskText}>{task.description}</Text>}
      </View>
    )
  }

  return (
    <Calendar
      markingType={'custom'} // カスタムマークを有効にする
      markedDates={markedDates} // マークされた日付を設定
      dayComponent={renderDay} // カスタム日付コンポーネント
      style={styles.calendar}
    />
  )
}

// スタイル設定
const styles = StyleSheet.create({
  calendar: {
    marginTop: 20,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // 各日付セルの高さを調整
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskText: {
    fontSize: 10,
    color: 'blue', // タスクの文字色
    textAlign: 'center',
    marginTop: 2,
  },
})

export default CustomCalendar
