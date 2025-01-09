import React, { useState, useEffect } from 'react'
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
import axios from 'axios'
import BACKEND_URL from '../utils/config'

// タスクのインターフェース (Flask 側で返す JSON に合わせる)
interface Task {
    id: number;
    title: string;
    kind: string;
    startdate: string;  // "2024-11-21" など ISO 形式
    enddate: string;    // "2024-11-28"
    starttime: string;  // "12:00"
    endtime: string;    // "18:00"
    place: string;
    notice: number;
    url?: string;
    memo?: string;
}

const test: React.FC<{ navigation: any }> = ({ navigation }) => {
    // タスク一覧
    const [taskList, setTaskList] = useState<Task[]>([])
    
    // 選択されたタスク
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    
    // モーダル表示状態
    const [isModalVisible, setIsModalVisible] = useState(false)
    
    // 画面表示時 (マウント時) にタスク一覧を取得
    useEffect(() => {
        fetchTasks()
    }, [])

    // タスク一覧取得
    const fetchTasks = async () => {
        try {
            // Flask が 127.0.0.1:5000 で起動している場合
            // （iOS/Android シミュレータを使う場合は別の IP (10.0.2.2 など) が必要になることも）
            const response = await axios.get<Task[]>(`${BACKEND_URL}/task_list`)
            setTaskList(response.data)
        } catch (error) {
            console.error('タスク取得エラー: ', error)
        }
    }

    // モーダルを開く
    const openModal = (task: Task) => {
        setSelectedTask(task)
        setIsModalVisible(true)
    }
    // モーダルを閉じる
    const closeModal = () => {
        setSelectedTask(null)
        setIsModalVisible(false)
    }

    // タスク表示
    const renderTask = ({ item }: { item: Task }) => (
        <TouchableOpacity
            style={styles.selectBox}
            onPress={() => openModal(item)}
        >
            <Text>
                {item.title} {item.kind}{'\n'}
                {/* 日付や時刻をシンプルにそのまま表示 */}
                {item.enddate} {item.starttime} {item.place}
            </Text>
        </TouchableOpacity>
    )

    // 通知時刻ラベル
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

    // 日付表示まとめ
    const getDate = (startDate: string, endDate: string): string => {
        if (startDate === endDate) {
            return startDate
        }
        return `${startDate} - ${endDate}`
    }

    // 時刻表示まとめ
    const getTime = (startTime: string, endTime: string): string => {
        if (startTime === endTime) {
            return startTime
        }
        return `${startTime} - ${endTime}`
    }

    // カレンダー用マーク設定
    const markedDates = taskList.reduce((acc, task) => {
        // "2024-11-21" のような文字列をキーにする
        // ISO 形式ならそのまま使える
        const dateKey = task.startdate
        if (dateKey) {
            acc[dateKey] = { marked: true, dotColor: 'red' }
        }
        return acc
    }, {} as Record<string, any>)

    return (
        <View>
            <Text style={styles.TitleText}>タスク一覧</Text>
            
            {/* タスクリスト */}
            <FlatList
                data={taskList}
                renderItem={renderTask}
                keyExtractor={(item) => `${item.id}`}
            />

            {/* モーダル */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>予定詳細</Text>
                        {selectedTask && (
                            <>
                                <Text style={styles.optionText}>
                                    タイトル: {selectedTask.title}
                                </Text>
                                <Text style={styles.optionText}>
                                    種類: {selectedTask.kind}
                                </Text>
                                <Text style={styles.optionText}>
                                    日付: {getDate(selectedTask.startdate, selectedTask.enddate)}
                                </Text>
                                <Text style={styles.optionText}>
                                    時刻: {getTime(selectedTask.starttime, selectedTask.endtime)}
                                </Text>
                                <Text style={styles.optionText}>
                                    通知時刻: {getNoticeTimeLabel(selectedTask.notice)}
                                </Text>
                                <Text style={styles.optionText}>
                                    場所: {selectedTask.place}
                                </Text>
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
                style={{ marginTop: 20 }}
                markingType={'custom'}
                markedDates={markedDates}
            />

            {/* フッターボタン */}
            <Button
                title="タスクを追加"
                onPress={() => navigation.navigate('AddTask')}
            />
            <Button
                title="ホーム"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    )
}

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

export default test
