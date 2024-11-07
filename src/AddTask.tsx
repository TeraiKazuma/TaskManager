import React, { useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Button, TextInput,  Platform, Modal,} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type Option = {
    id: number;
    label: string;
};

const options: Option[] = [
    { id: 1, label: '予定' },
    { id: 2, label: 'タスク' },
    { id: 3, label: 'イベント' },
];

const AddTask = ({navigation} :any)=>{
    const [date, setDate] = useState<Date>(new Date());
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);

    const openModal = () => setIsVisible(true);
    const closeModal = () => setIsVisible(false);

    // 日時が変更されたときの処理
    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    // 日付選択モードの設定
    const showMode = (currentMode: 'date' | 'time') => {
        setShow(true);
        setMode(currentMode);
    };

    // 日付選択の表示
    const showDatepicker = () => {
        showMode('date');
    };

    // 時刻選択の表示
    const showTimepicker = () => {
        showMode('time');
    };

    const handleOptionSelect = (option: Option) => {
        setSelectedOption(option);
        closeModal();
    };

    return(
        <View>
            <Text style={{fontSize: 20, textAlign:'center', marginTop:10}}>新規予定</Text>
            <Text>■タイトル</Text>
            <TextInput 
                style={styles.input}
                placeholder='タイトル'
                keyboardType="numeric"/>
            <Text style={{...Platform.select({
            android: {
                marginBottom: 30,
            }})}}>■種類</Text>
            <View style={styles.container}>
            <TouchableOpacity style={styles.selectBox} onPress={openModal}>
                <Text style={styles.selectText}>{selectedOption ? selectedOption.label : '種類'}</Text>
            </TouchableOpacity>
            <Modal
                visible={isVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>オプションを選択してください</Text>
                    {options.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        onPress={() => handleOptionSelect(option)}
                        style={styles.optionButton}
                    >
                        <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>閉じる</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
            </View>
            <Text style={{...Platform.select({
            android: {
                marginTop: 30,
            }})}}>■日時</Text>
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
            <TextInput 
                style={styles.input}
                placeholder='通知時刻'
                keyboardType="numeric"/>
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
        ...Platform.select({
            android: {
                marginTop: 50,
                marginBottom: 50,
            }
        }
        ),
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

export default AddTask;