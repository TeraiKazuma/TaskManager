// CalendarDayItem.tsx
// カレンダー1日分のセルの描画コンポーネント
// タスクが複数ある場合、それぞれを小さなバーとしてセル上に表示する仕組み

import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { DateData } from 'react-native-calendars'
import { CalendarItem } from './CalendarItem'

// MyDayProps は日付セルに渡される基本情報と状態の型定義
export type MyDayProps = {
  date?: DateData;   // { year, month, day, dateString }
  state?: '' | 'disabled' | 'today' | 'selected' | 'inactive';
  children?: React.ReactNode; // 日付の数字がchildren
};

// タスクバーの高さ
export const CELL_HEIGHT = 16
// 一日に表示可能なタスク数
const MAX_EVENTS = 5
// タスクバーの隙間
const CELL_ITEM_PADDING = 2
// タスクバーの角の丸さ
const CELL_RADIUS = 3

//カレンダー上の1日分のセルの描画コンポーネント。
type Props = MyDayProps & {
  eventItems: Map<string, CalendarItem[]>; // 日付文字列をキーとしたイベント配列のマップ
  cellMinHeight: number; // セルの最低高さ
};

export const CalendarDayItem: React.FC<Props> = (props) => {
  const { date, state, children, eventItems, cellMinHeight } = props

  // 該当する日のイベントを取得
  // イベントマップから、当日(dateString)に対応するイベントを取得して返す。
  // ソート方法は index の降順になっている。
  const events = useMemo(() => {
    if (!date?.dateString) return []
    return (eventItems.get(date.dateString) ?? []).sort(
      (a, b) => b.index - a.index
    )
  }, [date, eventItems])

  // 日付セルを押したとき
  const onDayPress = useCallback(() => {
    console.log('日付セルがタップされました:', date?.dateString)
  }, [date])

  // タスクバーを押したとき
  const onEventPress = useCallback((item: CalendarItem) => {
    console.log('イベントがタップされました:', item.text)
  }, [])

  // タスクバー1本の描画
  const renderEvent = useCallback(
    (ev: CalendarItem, i: number) => {
      // タスクバーの左/右の角の丸さを必要に応じて設定
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
          {/* 1日で完結するタスク('all')か複数にわたるタスクの開始日('start')の場合にテキストを表示する */}
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
          // 一日に表示する最大イベント数以上が入っても、セルの上限高さを決めておく
          maxHeight: MAX_EVENTS * (CELL_HEIGHT + CELL_ITEM_PADDING) + 20,
          // stateが 'disabled' のときは不透明度を落とす
          opacity: state === 'disabled' ? 0.4 : 1,
        },
      ]}
      onPress={onDayPress}
    >
      {/* children には日付の数字が入っている */}  
      <Text style={[styles.dayText, state === 'today' && styles.todayText]}>
        {children}
      </Text>

      {/* 該当日のタスクバー一覧を表示 */}
      <View>{events.map(renderEvent)}</View>
    </TouchableOpacity>
  )
}

// スタイル定義
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
