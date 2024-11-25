import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./test.css";

function App() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <DatePicker 
        selected={startDate}
        onChange={(date:any) => setStartDate(date)}
        showTimeSelect  // 時間選択を有効にするプロパティ
        dateFormat="yyyy/MM/dd h:mm aa"  // 日付と時間のフォーマット
        placeholderText="Select a date"
      />
    </div>
  );
  
}

export default App;