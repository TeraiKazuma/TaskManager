// AddTask.tsx
// 新規タスク(予定)を追加する画面

import React, { useState } from 'react'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  TextInput,
  Platform,
  Modal,
  Alert,
  KeyboardAvoidingView,
} from 'react-native'
import BACKEND_URL from '../utils/config'
import { getToken } from '../utils/auth'
import DateTimePicker from '@react-native-community/datetimepicker'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ja } from 'date-fns/locale'

// タスクの種類を定義する型
type TaskOption = {
  id: string
  label: string
}

// 通知時間を定義する型
type NoticeOption = {
  id: number
  label: string
}

// タスクの種類リスト
const taskKind: TaskOption[] = [
  { id: 'schedule', label: '予定' },
  { id: 'task', label: 'タスク' },
  { id: 'event', label: 'イベント' },
]

// 通知時間の選択肢
const noticeKind: NoticeOption[] = [
  { id: 0, label: '0分前' },
  { id: 10, label: '10分前' },
  { id: 30, label: '30分前' },
  { id: 60, label: '1時間前' },
  { id: 720, label: '12時間前' },
  { id: 1440, label: '1日前' },
]

const AddTask: React.FC = ({ navigation }: any) => {
  // 日付時刻関連のステート
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  // iOSではピッカーを常に表示するため、初期値はPlatform.OS === 'ios'
  const [startDateVisible, setStartDateVisible] = useState<boolean>(
    Platform.OS === 'ios'
  )
  const [startTimeVisible, setStartTimeVisible] = useState<boolean>(
    Platform.OS === 'ios'
  )
  const [endDateVisible, setEndDateVisible] = useState<boolean>(
    Platform.OS === 'ios'
  )
  const [endTimeVisible, setEndTimeVisible] = useState<boolean>(
    Platform.OS === 'ios'
  )

  // 入力系ステート
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState('')
  const [place, setPlace] = useState('')
  const [nottime, setNottime] = useState(0)
  const [url, setUrl] = useState('')
  const [memo, setMemo] = useState('')

  // モーダル(種類選択・通知選択)の表示制御
  const [isKindModalVisible, setIsKindModalVisible] = useState(false)
  const [isNoticeModalVisible, setIsNoticeModalVisible] = useState(false)

  // 選択された種類＆通知オプションを管理
  const [selectedOption, setSelectedOption] = useState<TaskOption | null>(null)
  const [selectedNOption, setSelectedNOption] = useState<NoticeOption | null>(
    null
  )

  // 日時表示用フォーマットオプション
  const timeOptions: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }

  // モーダル操作
  const openKindModal = () => setIsKindModalVisible(true)
  const closeKindModal = () => setIsKindModalVisible(false)
  const openNoticeModal = () => setIsNoticeModalVisible(true)
  const closeNoticeModal = () => setIsNoticeModalVisible(false)

  // 日付変更ハンドラ
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate
    setStartDateVisible(Platform.OS === 'ios')
    setStartDate(currentDate)
    if (currentDate > endDate) setEndDate(currentDate)
  }

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate
    setEndDateVisible(Platform.OS === 'ios')
    setEndDate(currentDate)
    if (currentDate < startDate) setStartDate(currentDate)
  }

  // 時間変更ハンドラ
  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate
    setStartTimeVisible(Platform.OS === 'ios')
    setStartDate(currentDate)
    if (currentDate > endDate) setEndDate(currentDate)
  }

  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate
    setEndTimeVisible(Platform.OS === 'ios')
    setEndDate(currentDate)
    if (currentDate < startDate) setStartDate(currentDate)
  }

  // Web用の日付変更ハンドラ
  const handleStartChange = (selectedDate: Date | null) => {
    const currentDate = selectedDate || startDate
    setStartDate(currentDate)
    if (currentDate && endDate && currentDate > endDate) setEndDate(currentDate)
  }

  const handleEndChange = (selectedDate: Date | null) => {
    const currentDate = selectedDate || endDate
    setEndDate(currentDate)
    if (currentDate && startDate && currentDate < startDate)
      setStartDate(currentDate)
  }

  // 種類選択時
  const handleOptionSelect = (option: TaskOption) => {
    setSelectedOption(option)
    setKind(option.label)
    closeKindModal()
  }

  // 通知選択時
  const handleNoticeSelect = (option: NoticeOption) => {
    setSelectedNOption(option)
    setNottime(option.id)
    closeNoticeModal()
  }

  // タスク追加処理
  const handleAddTask = async () => {
    try {
      // 認証トークン取得
      const token = await getToken()
      // サーバーにPOST
      const response = await fetch(`${BACKEND_URL}/Add_task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          kind,
          place,
          nottime,
          url,
          memo,
          startdate: startDate.toISOString(), // 日付を ISO文字列化
          enddate: endDate.toISOString(),
        }),
      })

      const data = await response.json()
      if (response.ok) {
        // 追加成功時の処理
        if (Platform.OS === 'web') {
          window.alert('追加成功: ' + data.message)
        } else {
          Alert.alert('追加成功', data.message)
        }
        // 一覧ページに遷移
        navigation.navigate('ListTask')
      } else {
        if (Platform.OS === 'web') {
          window.alert('追加失敗: ' + data.message)
        } else {
          Alert.alert('追加失敗', data.message)
        }
      }
    } catch (error) {
      console.error(error)
      if (Platform.OS === 'web') {
        window.alert('エラー: サーバーに接続できませんでした。')
      } else {
        Alert.alert('エラー', 'サーバーに接続できませんでした。')
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* ヘッダーを装飾 */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>新規予定</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* 入力フォーム全体をカード風にまとめる */}
        <View style={styles.formContainer}>
          {/* タイトル入力 */}
          <Text style={styles.label}>■タイトル</Text>
          <TextInput
            style={styles.input}
            placeholder="タイトル"
            value={title}
            onChangeText={setTitle}
          />

          {/* 種類選択 */}
          <Text style={styles.label}>■種類</Text>
          <TouchableOpacity style={styles.selectBox} onPress={openKindModal}>
            <Text style={styles.selectText}>
              {selectedOption ? selectedOption.label : '種類'}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={isKindModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={closeKindModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>スケジュール種類を選択</Text>
                {taskKind.map((toption) => (
                  <TouchableOpacity
                    key={toption.id}
                    onPress={() => handleOptionSelect(toption)}
                    style={styles.optionButton}
                  >
                    <Text style={styles.optionText}>{toption.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={closeKindModal}
                  style={[styles.closeButton, { marginTop: 10 }]}
                >
                  <Text style={styles.closeButtonText}>閉じる</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* 開始日時 */}
          <Text style={styles.label}>■開始日時</Text>
          <View style={styles.dateDisplayBox}>
            <Text style={styles.dateDisplayText}>
              {startDate.toLocaleDateString()}{' '}
              {startDate.toLocaleTimeString('ja-JP', timeOptions)}
            </Text>
          </View>

          {/* Web の場合は react-datepicker を使う */}
          {Platform.OS === 'web' && (
            <DatePicker
              selected={startDate}
              onChange={handleStartChange}
              locale={ja}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy/MM/dd HH:mm"
              placeholderText="開始日時を選択"
            />
          )}

          {/* Androidのときは DateTimePicker を使い、ボタン押下で表示 */}
          {Platform.OS === 'android' && (
            <>
              <TouchableOpacity
                onPress={() => setStartDateVisible(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonText}>
                  {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStartTimeVisible(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonText}>
                  {startDate.toLocaleTimeString('ja-JP', timeOptions)}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* iOS / Android共通: ピッカー表示を制御 */}
          {(Platform.OS === 'android' || Platform.OS === 'ios') && (
            <View style={styles.dateTimeContainer}>
              {startDateVisible && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onStartDateChange}
                  locale="ja-JP"
                />
              )}
              {startTimeVisible && (
                <DateTimePicker
                  value={startDate}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onStartTimeChange}
                  locale="ja-JP"
                />
              )}
            </View>
          )}

          {/* 終了日時 */}
          <Text style={styles.label}>■終了日時</Text>
          <View style={styles.dateDisplayBox}>
            <Text style={styles.dateDisplayText}>
              {endDate.toLocaleDateString()}{' '}
              {endDate.toLocaleTimeString('ja-JP', timeOptions)}
            </Text>
          </View>

          {Platform.OS === 'web' && (
            <DatePicker
              selected={endDate}
              onChange={handleEndChange}
              locale={ja}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy/MM/dd HH:mm"
              placeholderText="終了日時を選択"
            />
          )}

          {Platform.OS === 'android' && (
            <>
              <TouchableOpacity
                onPress={() => setEndDateVisible(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonText}>
                  {endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEndTimeVisible(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonText}>
                  {endDate.toLocaleTimeString('ja-JP', timeOptions)}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {(Platform.OS === 'android' || Platform.OS === 'ios') && (
            <View style={styles.dateTimeContainer}>
              {endDateVisible && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onEndDateChange}
                  locale="ja-JP"
                />
              )}
              {endTimeVisible && (
                <DateTimePicker
                  value={endDate}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onEndTimeChange}
                  locale="ja-JP"
                />
              )}
            </View>
          )}

          {/* 場所入力 */}
          <Text style={styles.label}>■場所</Text>
          <TextInput
            style={styles.input}
            placeholder="場所"
            value={place}
            onChangeText={setPlace}
          />

          {/* 通知時刻(何分前通知か) */}
          <Text style={styles.label}>■通知時刻</Text>
          <TouchableOpacity style={styles.selectBox} onPress={openNoticeModal}>
            <Text style={styles.selectText}>
              {selectedNOption ? selectedNOption.label : '通知時刻'}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={isNoticeModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={closeNoticeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>通知時刻を選択</Text>
                {noticeKind.map((noption) => (
                  <TouchableOpacity
                    key={noption.id}
                    onPress={() => handleNoticeSelect(noption)}
                    style={styles.optionButton}
                  >
                    <Text style={styles.optionText}>{noption.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={closeNoticeModal}
                  style={[styles.closeButton, { marginTop: 10 }]}
                >
                  <Text style={styles.closeButtonText}>閉じる</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* URL */}
          <Text style={styles.label}>■URL</Text>
          <TextInput
            style={styles.input}
            placeholder="URL"
            value={url}
            onChangeText={setUrl}
          />

          {/* メモ */}
          <Text style={styles.label}>■メモ</Text>
          <TextInput
            style={styles.input}
            placeholder="メモ"
            value={memo}
            onChangeText={setMemo}
          />

          {/* タスク追加ボタン */}
          <View style={styles.buttonContainer}>
            <Button title="タスクを追加" onPress={handleAddTask} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="一覧へ" onPress={() => navigation.navigate('ListTask')} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  // 全体コンテナ
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  // ヘッダー部分
  headerContainer: {
    backgroundColor: '#87CEEB',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  // スクロール領域
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  // 入力フォーム全体をまとめる
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    // カードっぽい影
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2, // Android用
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  selectBox: {
    height: 40,
    justifyContent: 'center',
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  // モーダル
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    // カード風の影
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#999',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  // 日付表示エリア
  dateDisplayBox: {
    height: 40,
    justifyContent: 'center',
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  dateDisplayText: {
    fontSize: 16,
    color: '#333',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  // ボタンコンテナ
  buttonContainer: {
    marginTop: 10,
  },
})

export default AddTask
