// MyDayProps.ts
import type { DateData } from 'react-native-calendars'

/**
 * react-native-calendars の dayComponent に渡される基本 props を
 * 自前で型定義した例。
 *
 * バージョンによってはDayPropsがエクスポートされていないことがあるので、
 * 必要な項目だけ独自定義する。
 */
export interface MyDayProps {
  /** その日付の基本情報 (year, month, day, dateStringなど) */
  date?: DateData

  /**
   * state は "disabled" | "today" | "selected" | "" などが入る。
   * - "disabled" → 他月
   * - "today" → 今日
   * - "selected" → 選択状態
   * - 空文字 → 通常日
   */
  state?: '' | 'disabled' | 'today' | 'selected' | 'inactive'

  /**
   * children には「日付数字」が入る (例: 1, 2, 3...)
   * react-native-calendars の仕様上、dayComponent の中で
   * {children} をそのまま表示すると各セルの日付が表示される。
   */
  children?: React.ReactNode

  // もし必要なら marking や onPress, onLongPress なども定義
  // marking?: any
  // onPress?: (date?: DateData) => any
  // onLongPress?: (date?: DateData) => any
}
