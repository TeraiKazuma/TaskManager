// CalendarDayItem.tsx
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { DateData } from 'react-native-calendars'
import { CalendarItem } from './CalendarItem'

export type MyDayProps = {
  date?: DateData;   // { year, month, day, dateString }
  // state に "inactive" 等が来る場合もあるので含める
  state?: '' | 'disabled' | 'today' | 'selected' | 'inactive';
  children?: React.ReactNode; // 日付の数字が children になる
};

export const CELL_HEIGHT = 16
const MAX_EVENTS = 5
const CELL_ITEM_PADDING = 2
const CELL_RADIUS = 3

/**
 * カレンダー上の「1日分のセル」を描画するコンポーネント。
 */
type Props = MyDayProps & {
  eventItems: Map<string, CalendarItem[]>;
  cellMinHeight: number; // セルの最低高さ
};

export const CalendarDayItem: React.FC<Props> = (props) => {
  const { date, state, children, eventItems, cellMinHeight } = props

  // ---------------------------
  // 該当日のイベントを取得
  // ---------------------------
  const events = useMemo(() => {
    if (!date?.dateString) return []
    // 同日のイベントを index の降順に並べる例
    return (eventItems.get(date.dateString) ?? []).sort(
      (a, b) => b.index - a.index
    )
  }, [date, eventItems])

  // 日付セルを押したとき
  const onDayPress = useCallback(() => {
    console.log('日付セルがタップされました:', date?.dateString)
  }, [date])

  // イベントバーを押したとき
  const onEventPress = useCallback((item: CalendarItem) => {
    console.log('イベントがタップされました:', item.text)
  }, [])

  // イベントバー1本の描画
  const renderEvent = useCallback(
    (ev: CalendarItem, i: number) => {
      const borderLeft =
        ev.type === 'start' || ev.type === 'all' ? CELL_RADIUS : 0
      const borderRight =
        ev.type === 'end' || ev.type === 'all' ? CELL_RADIUS : 0

      return (
        <TouchableOpacity
          key={`${ev.id}-${i}`}
          style={[
            styles.event,
            {
              backgroundColor: ev.color,
              top: ev.index * (CELL_HEIGHT + CELL_ITEM_PADDING),
              borderTopLeftRadius: borderLeft,
              borderBottomLeftRadius: borderLeft,
              borderTopRightRadius: borderRight,
              borderBottomRightRadius: borderRight,
            },
          ]}
          onPress={() => onEventPress(ev)}
        >
          {/* 1日完結('all')か開始日('start')でのみテキスト表示する例 */}
          {(ev.type === 'start' || ev.type === 'all') && (
            <View style={styles.eventRow}>
              <Text style={styles.eventText} numberOfLines={1}>
                {ev.text}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )
    },
    [onEventPress]
  )

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        {
          minHeight: cellMinHeight,
          maxHeight: MAX_EVENTS * (CELL_HEIGHT + CELL_ITEM_PADDING) + 20,
          // stateが 'disabled' のときは少し薄く表示する例
          opacity: state === 'disabled' ? 0.4 : 1,
        },
      ]}
      onPress={onDayPress}
    >
      {/* children には「日付数字」が入っている */}
      <Text style={[styles.dayText, state === 'today' && styles.todayText]}>
        {children}
      </Text>

      {/* 該当日のイベントバー一覧を表示 */}
      <View>{events.map(renderEvent)}</View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cell: {
    width: '100%',
    position: 'relative',
  },
  dayText: {
    textAlign: 'center',
    marginBottom: CELL_ITEM_PADDING,
  },
  todayText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  event: {
    width: '95%',
    height: CELL_HEIGHT,
    position: 'absolute',
    left: 0,
    zIndex: 2,
    justifyContent: 'center',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    paddingLeft: 2,
  },
})
