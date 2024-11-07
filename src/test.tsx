import React, { useState,} from 'react'
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, LayoutChangeEvent } from 'react-native'

type Option = {
  id: number
  label: string
}

const options: Option[] = [
  { id: 1, label: 'Option 1' },
  { id: 2, label: 'Option 2' },
  { id: 3, label: 'Option 3' },
]

const SelectionPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [inputWidth, setInputWidth] = useState<number | null>(null)

  const openModal = () => setIsVisible(true)
  const closeModal = () => setIsVisible(false)

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option)
    closeModal()
  }

  const handleInputLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setInputWidth(width)
  }

  return (
    <View style={styles.container}>
      {/* TextInput (ユーザーの入力フィールド) */}
      <TextInput
        placeholder="種類"
        style={styles.input}
        onLayout={handleInputLayout}
        editable={false} // 非編集にすることで、クリックして選択ができるようにします
        value={selectedOption ? selectedOption.label : ''}
      />

      {/* TouchableOpacity (ポップアップを表示するボタン) */}
      <TouchableOpacity style={[styles.selectBox, { width: inputWidth || '80%' }]} onPress={openModal}>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#f0f0f0',
    paddingLeft: 10,
    marginBottom: 10,
  },
  selectBox: {
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

export default SelectionPopup
