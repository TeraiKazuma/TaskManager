import React, { useState } from 'react'
import BACKEND_URL from '../utils/config'
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Button, TextInput, Platform, Modal, Alert } from 'react-native'
import { getToken } from '../utils/auth'
import DateTimePicker from '@react-native-community/datetimepicker'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ja } from 'date-fns/locale'

// タスクの種類を定義する型
type TaskOption = {
    id: string // タスクのID
    label: string // タスクの種類名
}

// 通知時間を定義する型
type NoticeOption = {
    id: number // 通知時間のID
    label: string // 通知時間を説明するラベル
}

// タスクの種類のリスト
const taskKind: TaskOption[] = [
    { id: 'schedule', label: '予定' },
    { id: 'task', label: 'タスク' },
    { id: 'event', label: 'イベント' },
]

// 通知時間の選択肢のリスト
const noticeKind: NoticeOption[] = [
    { id: 0, label: '0分前' },
    { id: 10, label: '10分前' },
    { id: 30, label: '30分前' },
    { id: 60, label: '1時間前' },
    { id: 720, label: '12時間前' },
    { id: 1440, label: '1日前' },
]

const AddTask: React.FC = ({ navigation }: any) => {
    // 日付と時刻選択のためのステート
    const [startDate, setStartDate] = useState<Date>(new Date()) // 初期値は現在時刻
    const [endDate, setEndDate] = useState<Date>(new Date())
    const [startDateVisible, setstartDateVisible] = useState<boolean>(Platform.OS === 'ios')
    const [startTimeVisible, setStartTimeVisible] = useState<boolean>(Platform.OS === 'ios')
    const [endDateVisible, setendDateVisible] = useState<boolean>(Platform.OS === 'ios')
    const [endTimeVisible, setEndTimeVisible] = useState<boolean>(Platform.OS === 'ios')
    const [title, setTitle] = useState('')
    const [kind, setKind] = useState('')
    const [place, setPlace] = useState('')
    const [nottime, setNottime] = useState(0)
    const [url, setUrl] = useState('')
    const [memo, setMemo] = useState('')
    const timeOptions: Intl.DateTimeFormatOptions = {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }

    // モーダルの表示制御用ステート
    const [isKindModalVisible, setIsKindModalVisible] = useState(false) // 種類選択モーダル
    const [isNoticeModalVisible, setIsNoticeModalVisible] = useState(false) // 通知時刻選択モーダル

    // 選択されたタスクの種類
    const [selectedOption, setSelectedOption] = useState<TaskOption | null>(null)

    // 選択された通知時間
    const [selectedNOption, setSelectedNOption] = useState<NoticeOption | null>(null)

    // 「種類」モーダルの開閉
    const openKindModal = () => setIsKindModalVisible(true) // モーダルを開く
    const closeKindModal = () => setIsKindModalVisible(false) // モーダルを閉じる

    // 「通知時刻」モーダルの開閉
    const openNoticeModal = () => setIsNoticeModalVisible(true) // モーダルを開く
    const closeNoticeModal = () => setIsNoticeModalVisible(false) // モーダルを閉じる

     // 年月日変更時に呼ばれる
    const onStartDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || startDate
        setstartDateVisible(Platform.OS === 'ios')
        setStartDate(currentDate)
    }
     // 年月日変更時に呼ばれる
     const onEndDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || endDate
        setendDateVisible(Platform.OS === 'ios')
        setEndDate(currentDate)
    }

    // 時分変更時に呼ばれる
    const onStartTimeChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || startDate
        setStartTimeVisible(Platform.OS === 'ios')
        setStartDate(currentDate)
    }  

    const onEndTimeChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || endDate
        setEndTimeVisible(Platform.OS === 'ios')
        setEndDate(currentDate)
    }  

    const handleStartChange = (selectedDate: Date | null) => {
        const currentDate = selectedDate || startDate
        setStartDate(currentDate)
        if (currentDate && endDate && currentDate > endDate) {
          setEndDate(currentDate)
        }
      }
    
      const handleEndChange = (selectedDate: Date | null) => {
        const currentDate = selectedDate || startDate
        setEndDate(currentDate)
        if (currentDate && startDate && currentDate < startDate) {
          setStartDate(currentDate)
        }
      }

    // タスクの種類を選択したときの処理
    const handleOptionSelect = (option: TaskOption) => {
        setSelectedOption(option) // 選択された種類を保存
        setKind(option.label)
        closeKindModal() // モーダルを閉じる
    }

    // 通知時間を選択したときの処理
    const NOptionSelect = (option: NoticeOption) => {
        setSelectedNOption(option) // 選択された通知時間を保存
        setNottime(option.id)
        closeNoticeModal() // モーダルを閉じる
    }
    
    const AddTask = async () => {
        try {
            const token = await getToken() //トークン取得
            
            const response = await fetch(`${BACKEND_URL}/Addtask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({title,kind,place,nottime,url,memo,
                    startdate: startDate.toISOString(), // ISO 8601形式（日時を含む）
                    enddate: endDate.toISOString(),
                }),
            })

            const data = await response.json()

            if (response.ok) {
                Alert.alert('追加成功', data.message)
            } else {
                Alert.alert('追加失敗', data.message)
            }
        } catch (error) {
            console.error(error)
            Alert.alert('エラー', 'サーバーに接続できませんでした。')
        }
    }
    

    return (
        <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        >
            <View>
                {/* 画面タイトル */}
                <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>新規予定</Text>

                {/* タイトル入力 */}
                <Text>■タイトル</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='タイトル'
                    onChangeText={setTitle}
                />

                {/* 種類選択 */}
                <Text>■種類</Text>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.modalselectBox} onPress={openKindModal}>
                        <Text style={styles.selectText}>{selectedOption ? selectedOption.label : '種類'}</Text>
                    </TouchableOpacity>

                    {/* 種類選択モーダル */}
                    <Modal
                        visible={isKindModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={closeKindModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>スケジュールを選択してください</Text>
                                {taskKind.map((toption) => (
                                    <TouchableOpacity
                                        key={toption.id}
                                        onPress={() => handleOptionSelect(toption)}
                                        style={styles.optionButton}
                                    >
                                        <Text style={styles.optionText}>{toption.label}</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity onPress={closeKindModal} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>閉じる</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                {/* 開始日時 */}
                <Text>■開始日時</Text>
                <Text  style={styles.selectDate}>
                    <Text>
                        {startDate.toLocaleDateString()} {startDate.toLocaleTimeString('ja-JP', timeOptions)}
                    </Text>
                </Text>
                {Platform.OS === 'web' &&
                <div>
                <label style={{marginLeft: '50' }}>
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
                </label>
              </div>
                }
                { Platform.OS === 'android' &&
                    <TouchableOpacity 
                    onPress={() => {setstartDateVisible(true)}} 
                    style={{ borderWidth: 1, borderColor: '#000', padding: 10, marginBottom: 20, borderRadius: 5 }}
                    >
                    <Text style={{ fontSize: 16 }}>{startDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                }
                { Platform.OS === 'android' &&
                    <TouchableOpacity 
                        onPress={() => {setStartTimeVisible(true)}} 
                        style={{ borderWidth: 1, borderColor: '#000', padding: 10, marginBottom: 20, borderRadius: 5 }}
                    >
                        <Text style={{ fontSize: 16 }}>{startDate.toLocaleTimeString('ja-JP', timeOptions)}</Text>
                    </TouchableOpacity>
                }
                { Platform.OS === 'android' && 'ios' &&
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        { startDateVisible &&
                            <DateTimePicker
                            value={startDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onStartDateChange}
                            locale="ja-JP"
                            style={{marginBottom: 20}}
                            />
                        }
                        { startTimeVisible &&
                            <DateTimePicker
                            value={startDate}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onStartTimeChange}
                            locale="ja-JP"
                            style={{marginBottom: 20,marginLeft:10}}
                            />
                        }
                    </View>
                }

                {/* 終了日時 */}
                <Text>■終了日時</Text>
                <Text  style={styles.selectDate}>
                    <Text>
                        {endDate.toLocaleDateString()} {endDate.toLocaleTimeString('ja-JP', timeOptions)}
                    </Text>
                </Text>
                {Platform.OS === 'web' &&
                <div>
                <label style={{marginLeft: '50' }}>
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
                </label>
              </div>
                }
                { Platform.OS === 'android' &&
                    <TouchableOpacity 
                    onPress={() => {setendDateVisible(true)}} 
                    style={{ borderWidth: 1, borderColor: '#000', padding: 10, marginBottom: 20, borderRadius: 5 }}
                    >
                    <Text style={{ fontSize: 16 }}>{endDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                }
                { Platform.OS === 'android' &&
                    <TouchableOpacity 
                        onPress={() => {setEndTimeVisible(true)}} 
                        style={{ borderWidth: 1, borderColor: '#000', padding: 10, marginBottom: 20, borderRadius: 5 }}
                    >
                        <Text style={{ fontSize: 16 }}>{endDate.toLocaleTimeString('ja-JP', timeOptions)}</Text>
                    </TouchableOpacity>
                }
                { Platform.OS === 'android' && 'ios' &&
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        { endDateVisible &&
                            <DateTimePicker
                            value={endDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onEndDateChange}
                            locale="ja-JP"
                            style={{marginBottom: 20}}
                            />
                        }
                        { endTimeVisible &&
                            <DateTimePicker
                            value={endDate}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onEndTimeChange}
                            locale="ja-JP"
                            style={{marginBottom: 20,marginLeft:10}}
                            />
                        }
                    </View>
                }
                
                {/* 場所入力 */}
                <Text>■場所</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='場所'
                    onChangeText={setPlace}
                />

                {/* 通知時刻選択 */}
                <Text>■通知時刻</Text>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.modalselectBox} onPress={openNoticeModal}>
                        <Text style={styles.selectText}>{selectedNOption ? selectedNOption.label : '通知時刻'}</Text>
                    </TouchableOpacity>
                    <Modal
                        visible={isNoticeModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={closeNoticeModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>通知時刻を選択してください</Text>
                                {noticeKind.map((noption) => (
                                    <TouchableOpacity
                                        key={noption.id}
                                        onPress={() => NOptionSelect(noption)}
                                        style={styles.optionButton}
                                    >
                                        <Text style={styles.optionText}>{noption.label}</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity onPress={closeNoticeModal} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>閉じる</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>

                {/* URL入力 */}
                <Text>■URL</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='URL'
                    onChangeText={setUrl}
                />

                {/* メモ入力 */}
                <Text>■メモ</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='メモ'
                    onChangeText={setMemo}
                />

                {/* タスク追加ボタン */}
                <Button title="タスクを追加" onPress={AddTask} />
                <Button title="一覧へ" onPress={() => navigation.navigate('ListTask')} />
            </View>
        </ScrollView>
    )
}

// スタイル定義
const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectBox: {
        width: Platform.OS === 'android' ? '94%' : '98.3%', 
        margin: 12,
        height: 40,
        justifyContent: 'center',
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#f0f0f0',
    },
    selectText: {
        fontSize: 16,
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
    selectDate:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        width: Platform.select({
            ios: '94%',     // iOS用
            android: '94%', // Android用
            web: '98.3%',     // Web用
        }),
        margin: 12,
        height: 40,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#f0f0f0',
        marginTop: 3,
    },
    modalselectBox: {
        width: Platform.select({
            ios: '94%',     // iOS用
            android: '94%', // Android用
            web: '98.3%',     // Web用
        }),
        margin: 12,
        height: 40,
        justifyContent: 'center',
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#f0f0f0',
    },
    scrollView: {
        flex: 1,
        overflow: 'scroll', // Webでスクロールを有効にする
      },
      contentContainer: {
        flexGrow: 1, // 内容がスクロール可能になるように設定
      },
})

export default AddTask
