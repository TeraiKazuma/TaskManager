// CalendarItem.ts
/**
 * カレンダーセルに表示するイベント(予定)を扱うための型
 */
export type CalendarItem = {
  id: string;
  index: number;      // 同日内での上下位置
  color: string;      // バーの色
  text: string;       // バーに表示するテキスト
  type: 'all' | 'start' | 'end' | 'between';
};