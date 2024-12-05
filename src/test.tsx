import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ja } from 'date-fns/locale'

const DateTimePicker: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date())

  const handleStartChange = (date: Date | null) => {
    setStartDate(date)
    if (date && endDate && date > endDate) {
      setEndDate(date)
    }
  }

  const handleEndChange = (date: Date | null) => {
    setEndDate(date)
    if (date && startDate && date < startDate) {
      setStartDate(date)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
      <h3>日時選択</h3>
      <label>
        開始日時:
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
      <label>
        終了日時:
        <DatePicker
          selected={endDate}
          onChange={handleEndChange}
          locale={ja}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy/MM/dd HH:mm"
          placeholderText="終了日時を選択"
          minDate={startDate || undefined}
        />
      </label>
    </div>
  )
}

export default DateTimePicker
