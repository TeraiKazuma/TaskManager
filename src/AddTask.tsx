import React, { useState } from 'react'
import { View, ScrollView, Text, StyleSheet,TouchableOpacity, Button, TextInput,  Platform, Modal,} from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'

type Toption = {
    id: string
    label: string
}

type Noption = {
    id: number
    label: string
}

const taskKind: Toption[] = [
    { id: 'schedule', label: '予定' },
    { id: 'task', label: 'タスク' },
    { id: 'event', label: 'イベント' },
]

const notice: Noption[] = [
    { id: 0, label: '0分前'},
    { id: 10, label: '10分前'},
    { id: 30, label: '30分前'},
    { id: 60, label: '1時間前'},
    { id: 720, label: '12時間前'},
    { id: 1440, label: '1日前'},

]

const AddTask = ({navigation} :any)=>{
    const [date, setDate] = useState<Date>(new Date())
    const [mode, setMode] = useState<'date' | 'time'>('date')
    const [show, setShow] = useState(false)

    const [isKindModalVisible, setIsKindModalVisible] = useState(false)
    const [isNoticeModalVisible, setIsNoticeModalVisible] = useState(false)
    const [selectedOption, setSelectedOption] = useState<Toption | null>(null)
    const [selectedNOption, setSelectedNOption] = useState<Noption | null>(null)

    // 「種類」モーダルの開閉関数
    const openKindModal = () => setIsKindModalVisible(true)
    const closeKindModal = () => setIsKindModalVisible(false)

  // 「通知時刻」モーダルの開閉関数
    const openNoticeModal = () => setIsNoticeModalVisible(true)
    const closeNoticeModal = () => setIsNoticeModalVisible(false)

    // 日時が変更されたときの処理
    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date
        setShow(Platform.OS === 'ios')
        setDate(currentDate)
    }

    // 日付選択モードの設定
    const showMode = (currentMode: 'date' | 'time') => {
        setShow(true)
        setMode(currentMode)
    }

    // 日付選択の表示
    const showDatepicker = () => {
        showMode('date')
    }

    // 時刻選択の表示
    const showTimepicker = () => {
        showMode('time')
    }

    const handleOptionSelect = (option: Toption) => {
        setSelectedOption(option)
        closeKindModal()
    }
    const NOptionSelect = (option: Noption) => {
        setSelectedNOption(option)
        closeNoticeModal()
    }

    return(
        <ScrollView>
            <View>
                <Text style={{fontSize: 20, textAlign:'center', marginTop:10}}>新規予定</Text>
                <Text>■タイトル</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='タイトル'
                    keyboardType="numeric"/>
                <Text >■種類</Text>
                <View style={styles.container}>
                <TouchableOpacity style={styles.selectBox} onPress={openKindModal}>
                    <Text style={styles.selectText}>{selectedOption ? selectedOption.label : '種類'}</Text>
                </TouchableOpacity>
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
                <Text>■場所</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='場所'
                    keyboardType="numeric"/>
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
                <Text>■URL</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='URL'
                    keyboardType="numeric"/>
                <Text>■メモ</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='メモ'
                    keyboardType="numeric"/>
                    
                <Button title="タスクを追加" onPress={() => navigation.navigate('ListTask')}></Button>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
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