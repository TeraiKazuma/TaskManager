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

// タスクのインターフェースを定義
interface Task {
    Title: string;
    Kind: string;
    Date: Date;
    Time: string;
    Spot: string;
    notice: number
}

const ListTask: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null) // 選択されたタスク
    const [isModalVisible, setIsModalVisible] = useState(false) // モーダル表示状態

    // タスクリストデータ
    const TaskList: Task[] = [
        {
            Title: '予定1',
            Kind: '予定',
            Date: new Date('2024-11-21'),
            Time: '12:00',
            Spot: 'KCG',
            notice:3
        },
        {
            Title: 'タスク2',
            Kind: 'タスク',
            Date: new Date('2024-11-28'),
            Time: '23:59',
            Spot: '',
            notice:1
        },
        {
            Title: 'イベント3',
            Kind: 'イベント',
            Date: new Date('2024-12-01'),
            Time: '10:00',
            Spot: '京都駅',
            notice:24
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
                {item.Date.toLocaleDateString('ja-JP')} {item.Time} {item.Spot}
            </Text>
        </TouchableOpacity>
    )
    const getNoticeTimeLabel = (notice: number): string => {
        if (notice < 1) {
            const minutes = notice * 60
            return `${Math.round(minutes)} 分前`
        } else if (notice < 24) {
            return `${Math.round(notice)} 時間前`
        } else {
            const days = notice / 24
            return `${Math.round(days)} 日前`
        }
    }


    return (
        <View>
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
                                    日付：{selectedTask.Date.toLocaleDateString('ja-JP')}
                                </Text>
                                <Text style={styles.optionText}>時刻：{selectedTask.Time}</Text>
                                <Text style={styles.optionText}>場所：{selectedTask.Spot}</Text>
                                <Text style={styles.optionText}>通知：{getNoticeTimeLabel(selectedTask.notice)}</Text>
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
})

export default ListTask