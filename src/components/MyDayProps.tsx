// MyDayProps.tsx

import type { DateData } from 'react-native-calendars'


export interface MyDayProps {
  //その日付の基本情報 (year, month, day, dateStringなど)
  date?: DateData

  /*
    "disabled" → 他月(カレンダーで非アクティブ)
    "today" → 今日
    "selected" → 選択状態
    "inactive" → 通常日
  */
  state?: '' | 'disabled' | 'today' | 'selected' | 'inactive'

  /*
    children には「日付数字」が入る (例: 1, 2, 3...)
    react-native-calendars の仕様上、dayComponent の中で
    {children} をそのまま表示すると各セルの日付が表示される。
  */
  children?: React.ReactNode
}
