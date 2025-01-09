import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder
} from 'react-native'
import axios from 'axios'

type Widget = {
  id: number
  content: string
  size: number
  x: number
  y: number
}

type Task = {
  id: number
  title: string
  completed: boolean
}

const GRID_SIZE = 4
const SCREEN_WIDTH = Dimensions.get('window').width
const CELL_SIZE = SCREEN_WIDTH / GRID_SIZE

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [, setTasks] = useState<Task[]>([])

  useEffect(() => {
    // Flaskからタスクを取得する
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/tasks')
        setTasks(response.data)
      } catch (error) {
        console.error('タスク取得エラー:', error)
      }
    }

    fetchTasks()
  }, [])

  const handleSelectWidget = (type: string) => {
    const newWidget: Widget = {
      id: widgets.length + 1,
      content: type,
      size: type === 'カレンダー' ? 2 : 1,
      x: 0,
      y: widgets.length
    }
    setWidgets((prev) => [...prev, newWidget])
    setModalVisible(false)
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const { dx, dy } = gestureState
      setWidgets((prevWidgets) => {
        const updatedWidgets = [...prevWidgets]
        const movingWidget = updatedWidgets[updatedWidgets.length - 1]
        if (movingWidget) {
          movingWidget.x += dx / CELL_SIZE
          movingWidget.y += dy / CELL_SIZE
        }
        return updatedWidgets
      })
    },
    onPanResponderRelease: () => {
      setWidgets((prevWidgets) => {
        const updatedWidgets = prevWidgets.map((widget) => ({
          ...widget,
          x: Math.round(widget.x),
          y: Math.round(widget.y)
        }))
        return updatedWidgets
      })
    }
  })

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.grid}>
        {widgets.map((widget) => (
          <View
            key={widget.id}
            style={[
              styles.cell,
              {
                width: CELL_SIZE * widget.size,
                height: CELL_SIZE,
                top: widget.y * CELL_SIZE,
                left: widget.x * CELL_SIZE
              }
            ]}
            {...panResponder.panHandlers}
          >
            <Text>{widget.content}</Text>
          </View>
        ))}
      </View>

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ウィジェットを追加</Text>
            <TouchableOpacity onPress={() => handleSelectWidget('タスク一覧')}>
              <Text>タスク一覧</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectWidget('カレンダー')}>
              <Text>カレンダー</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  grid: { position: 'absolute', width: '100%', height: '100%' },
  cell: {
    position: 'absolute',
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: { color: 'white', fontSize: 30, fontWeight: 'bold' }
})

export default HomeScreen