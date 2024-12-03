import React, { useState } from 'react'
import BACKEND_URL from './config'
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Button, TextInput, Platform, Modal, Alert } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'

// タスクの種類を定義する型
type Toption = {
    id: string // タスクのID
    label: string // タスクの種類名
}

// 通知時間を定義する型
type Noption = {
    id: number // 通知時間のID
    label: string // 通知時間を説明するラベル
}

// タスクの種類のリスト
const taskKind: Toption[] = [
    { id: 'schedule', label: '予定' },
    { id: 'task', label: 'タスク' },
    { id: 'event', label: 'イベント' },
]

// 通知時間の選択肢のリスト
const notice: Noption[] = [
    { id: 0, label: '0分前' },
    { id: 10, label: '10分前' },
    { id: 30, label: '30分前' },
    { id: 60, label: '1時間前' },
    { id: 720, label: '12時間前' },
    { id: 1440, label: '1日前' },
]

const AddTask = ({ navigation }: any) => {
    // 日付と時刻選択のためのステート
    const [date, setDate] = useState<Date>(new Date()) // 初期値は現在時刻
    const [mode, setMode] = useState<'date' | 'time'>('date') // 初期モードは「日付」
    const [show, setShow] = useState(false) // DateTimePickerの表示制御
    const [title, setTitle] = useState('')
    const [kind, setKind] = useState('')
    const [place, setPlace] = useState('')
    const [nottime, setNottime] = useState('')
    const [url, setUrl] = useState('')
    const [memo, setMemo] = useState('')

    // モーダルの表示制御用ステート
    const [isKindModalVisible, setIsKindModalVisible] = useState(false) // 種類選択モーダル
    const [isNoticeModalVisible, setIsNoticeModalVisible] = useState(false) // 通知時刻選択モーダル

    // 選択されたタスクの種類
    const [selectedOption, setSelectedOption] = useState<Toption | null>(null)

    // 選択された通知時間
    const [selectedNOption, setSelectedNOption] = useState<Noption | null>(null)

    // 「種類」モーダルの開閉
    const openKindModal = () => setIsKindModalVisible(true) // モーダルを開く
    const closeKindModal = () => setIsKindModalVisible(false) // モーダルを閉じる

    // 「通知時刻」モーダルの開閉
    const openNoticeModal = () => setIsNoticeModalVisible(true) // モーダルを開く
    const closeNoticeModal = () => setIsNoticeModalVisible(false) // モーダルを閉じる

    // 日付または時刻が変更されたときの処理
    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date // 選択された日付または現在の日付を使用
        setShow(Platform.OS === 'ios') // iOSの場合はPickerを閉じない
        setDate(currentDate) // 日付を更新
    }

    // 日付または時刻選択モードの設定
    const showMode = (currentMode: 'date' | 'time') => {
        setShow(true) // Pickerを表示
        setMode(currentMode) // モードを設定 (日付または時刻)
    }

    // 日付選択モードを表示
    const showDatepicker = () => {
        showMode('date')
    }

    // 時刻選択モードを表示
    const showTimepicker = () => {
        showMode('time')
    }

    // タスクの種類を選択したときの処理
    const handleOptionSelect = (option: Toption) => {
        setSelectedOption(option) // 選択された種類を保存
        setKind(option.label)
        closeKindModal() // モーダルを閉じる
    }

    // 通知時間を選択したときの処理
    const NOptionSelect = (option: Noption) => {
        setSelectedNOption(option) // 選択された通知時間を保存
        setNottime(option.label)
        closeNoticeModal() // モーダルを閉じる
    }
    
    const AddTask = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title,kind,place,nottime,url,memo,
                    date: date.toISOString(), // ISO 8601形式に変換
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
        <ScrollView>
            <View>
                {/* 画面タイトル */}
                <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>新規予定</Text>

                {/* タイトル入力 */}
                <Text>■タイトル</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='タイトル'
                    keyboardType="numeric" // 数字キーボードを指定
                    onChangeText={setTitle}
                />

                {/* 種類選択 */}
                <Text>■種類</Text>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.selectBox} onPress={openKindModal}>
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

                {/* 日時選択 */}
                <Text>■日時</Text>
                <View>
                    <Text style={styles.input}>{date.toLocaleString()}</Text>
                    <View>
                        <Button onPress={showDatepicker} title="日付を選択" />
                        <Button onPress={showTimepicker} title="時刻を選択" />
                    </View>
                    {show && (
                        <DateTimePicker
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )}
                </View>

                {/* 場所入力 */}
                <Text>■場所</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='場所'
                    keyboardType="numeric"
                    onChangeText={setPlace}
                />

                {/* 通知時刻選択 */}
                <Text>■通知時刻</Text>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.selectBox} onPress={openNoticeModal}>
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
                                {notice.map((noption) => (
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
                    keyboardType="numeric"
                    onChangeText={setUrl}
                />

                {/* メモ入力 */}
                <Text>■メモ</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='メモ'
                    keyboardType="numeric"
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
})

export default AddTask
