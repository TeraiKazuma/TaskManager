import React, { useState } from 'react'
import { View, Text, FlatList, Button, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { isSameDay, isSameWeek, isSameMonth } from 'date-fns'

interface Task {
  id: string
  title: string
  description?: string
  date: string // YYYY-MM-DD形式
}

const tasks: Task[] = [
  { id: '1', title: 'ミーティング', date: '2024-11-19' },
  { id: '2', title: '買い物', date: '2024-11-19' },
  { id: '3', title: 'プレゼン準備', date: '2024-11-20' },
  { id: '4', title: '運動', date: '2024-11-21' },
  // 他のタスクを追加
]

const TaskListScreen: React.FC = () => {
  const [viewRange, setViewRange] = useState<'day' | 'week' | 'month'>('day')
  const [selectedDate, setSelectedDate] = useState(new Date())

  // 表示範囲に基づいてタスクをフィルタリング
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date)

    if (viewRange === 'day') {
      return isSameDay(taskDate, selectedDate)
    } else if (viewRange === 'week') {
      return isSameWeek(taskDate, selectedDate)
    } else if (viewRange === 'month') {
      return isSameMonth(taskDate, selectedDate)
    }
    return false
  })

  // カレンダーにマークを付ける
  const markedDates = tasks.reduce((acc: any, task) => {
    acc[task.date] = { marked: true }
    return acc
  }, {})

  // 選択された日付をマーク
  const selectedDateString = selectedDate.toISOString().split('T')[0]
  markedDates[selectedDateString] = {
    ...(markedDates[selectedDateString] || {}),
    selected: true,
    selectedColor: 'blue',
  }

  return (
    <View style={styles.container}>
      {/* 表示範囲の切り替えボタン */}
      <View style={styles.buttonContainer}>
        <Button title="日" onPress={() => setViewRange('day')} />
        <Button title="週" onPress={() => setViewRange('week')} />
        <Button title="月" onPress={() => setViewRange('month')} />
      </View>

      {/* カレンダー表示 */}
      <Calendar
        onDayPress={(day:any) => {
          setSelectedDate(new Date(day.dateString))
        }}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: 'blue',
          todayTextColor: 'red',
        }}
      />

      {/* タスク一覧表示 */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            {item.description && <Text style={styles.taskDescription}>{item.description}</Text>}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noTaskText}>タスクがありません</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    marginTop: 5,
    color: '#555',
  },
  noTaskText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
})

export default TaskListScreen
