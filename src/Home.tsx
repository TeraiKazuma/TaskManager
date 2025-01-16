// Home.tsx
// ホーム画面
// 現在作成中

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

// Widget型の定義
type Widget = {
  id: number
  content: string
  size: number
  x: number
  y: number
}

// Task型の定義
type Task = {
  id: number
  title: string
  completed: boolean
}

// グリッドの数
const GRID_SIZE = 4
// 画面幅を取得
const SCREEN_WIDTH = Dimensions.get('window').width
// セル1つ分の幅を算出 (画面幅 / グリッド数)
const CELL_SIZE = SCREEN_WIDTH / GRID_SIZE

const HomeScreen = () => {
  // ウィジェットを追加するためのモーダル可否
  const [modalVisible, setModalVisible] = useState(false)
  // 配置されたウィジェット一覧
  const [widgets, setWidgets] = useState<Widget[]>([])
  // タスク一覧(使っていないが例として保持)
  const [, setTasks] = useState<Task[]>([])

  // 初回マウント時にタスクをFlaskから取得する例
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

  // ウィジェットを追加 (typeによって内容やサイズを変える例)
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

  // ドラッグ操作を扱うためのPanResponder
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const { dx, dy } = gestureState
      setWidgets((prevWidgets) => {
        const updatedWidgets = [...prevWidgets]
        // 最後に追加されたウィジェットを移動している例
        const movingWidget = updatedWidgets[updatedWidgets.length - 1]
        if (movingWidget) {
          movingWidget.x += dx / CELL_SIZE
          movingWidget.y += dy / CELL_SIZE
        }
        return updatedWidgets
      })
    },
    onPanResponderRelease: () => {
      // ドラッグ終了時にグリッドにスナップ
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
      {/* グリッドエリア */}
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

      {/* モーダルウィンドウ(ウィジェット選択) */}
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

      {/* ウィジェット追加ボタン */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>
    </View>
  )
}

// スタイル定義
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
