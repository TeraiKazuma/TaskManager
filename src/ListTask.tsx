import React, { useState } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Button,
} from 'react-native'
import { Calendar } from 'react-native-calendars'

// タスクのインターフェースを定義
interface Task {
    Title: string;
    Kind: string;
    StartDate: Date;
    EndDate: Date;
    StartTime: string;
    EndTime: string;
    Spot: string;
    notice: number
}

const ListTask: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null) // 選択されたタスク
    const [isModalVisible, setIsModalVisible] = useState(false) // モーダル表示状態
    const [selectedDate, setSelectedDate] = useState<string>('')
    
    // タスクリストデータ
    const TaskList: Task[] = [
        {
            Title: '予定1',
            Kind: '予定',
            StartDate: new Date('2024-11-21'),
            EndDate: new Date('2024-11-21'),
            StartTime: '12:00',
            EndTime: '18:00',
            Spot: 'KCG',
            notice: 3
        },
        {
            Title: 'タスク2',
            Kind: 'タスク',
            StartDate: new Date('2024-11-21'),
            EndDate: new Date('2024-11-28'),
            StartTime: '23:59',
            EndTime: '23:59',
            Spot: 'q',
            notice: 1
        },
        {
            Title: 'イベント3',
            Kind: 'イベント',
            StartDate: new Date('2024-12-01'),
            EndDate: new Date('2024-12-01'),
            StartTime: '10:00',
            EndTime: '17:00',
            Spot: '京都駅',
            notice: 24
        },
    ]

    // モーダルを開く関数
    const openModal = (task: Task) => {
        setSelectedTask(task) // 選択されたタスクを設定
        setIsModalVisible(true) // モーダルを表示
    }

    // モーダルを閉じる関数
    const closeModal = () => {
        setSelectedTask(null) // 選択タスクをクリア
        setIsModalVisible(false) // モーダルを非表示
    }

    // タスクをレンダリングする関数
    const renderTask = ({ item }: { item: Task }) => (
        <TouchableOpacity
            style={styles.selectBox}
            onPress={() => openModal(item)} // タップでモーダルを開く
        >
            <Text>
                {item.Title} {item.Kind} {'\n'}
                {item.EndDate.toLocaleDateString('ja-JP')} {item.StartTime} {item.Spot}
            </Text>
        </TouchableOpacity>
    )

    const getNoticeTimeLabel = (notice: number): string => {
        if (notice < 1) {
            const minutes = notice * 60
            return `${minutes} 分前`
        } else if (notice < 24) {
            return `${notice} 時間前`
        } else {
            const days = notice / 24
            return `${days} 日前`
        }
    }

    const getDate = (StartDate: string,EndDate: string): string => {
        if(StartDate==EndDate){
            return StartDate
        }else{
            return `${StartDate}-${EndDate}`
        }
    }
    const getTime = (StartTime: string,EndTime: string): string => {
        if(StartTime==EndTime){
            return StartTime
        }else{
            return `${StartTime}-${EndTime}`
        }
    }


    // カレンダー用に日付をフォーマット
    const markedDates = TaskList.reduce((acc, task) => {
        const dateKey = task.StartDate.toISOString().split('T')[0]
        acc[dateKey] = { marked: true, dotColor: 'red' } // 赤いドットを表示
        return acc
    }, {} as Record<string, any>)

    return (
        <View>
            <Text style={styles.TitleText}>タスク一覧</Text>
            {/* タスクリスト */}
            <FlatList<Task>
                data={TaskList}
                renderItem={renderTask}
                keyExtractor={(item, index) => `${item.Title}-${index}`} // ユニークキー
            />

            {/* モーダル */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal} // Androidバックボタンで閉じる
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>予定詳細</Text>
                        {selectedTask && (
                            <>
                                <Text style={styles.optionText}>タイトル：{selectedTask.Title}</Text>
                                <Text style={styles.optionText}>種類：{selectedTask.Kind}</Text>
                                <Text style={styles.optionText}>
                                    日付：{getDate(selectedTask.StartDate.toLocaleDateString('ja-JP'),selectedTask.EndDate.toLocaleDateString('ja-JP'))}
                                </Text>
                                <Text style={styles.optionText}>時刻：{getTime(selectedTask.StartTime,selectedTask.EndTime)}</Text>
                                 {/* 通知時刻を判別して表示 */}
                                <Text style={styles.optionText}>
                                    通知時刻: {getNoticeTimeLabel(selectedTask.notice)}
                                </Text>
                                <Text style={styles.optionText}>場所：{selectedTask.Spot}</Text>
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
            <Calendar
                markedDates={{
                    ...markedDates, // タスクの日付をマーク
                    [selectedDate]: { selected: true, selectedColor: 'blue' }, // 選択日付をハイライト
                }}
                onDayPress={(day:any) => {
                    setSelectedDate(day.dateString) // 選択した日付を状態に保存
                }}
                style={{ marginTop: 20 }}
            />

            {/* フッターボタン */}
            <Button
                title="タスクを追加"
                onPress={() => navigation.navigate('AddTask')}
            />
            <Button title="ホーム" onPress={() => navigation.navigate('Home')} />
        </View>
    )
}

// スタイル定義
const styles = StyleSheet.create({
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
    selectBox: {
        margin: 12,
        height: 40,
        justifyContent: 'center',
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#f0f0f0',
    },
    TitleText: {
        fontSize: 20, 
        textAlign:'center', 
        marginTop:10
    },
})

export default ListTask
