// CalendarItem.ts
/**
 * カレンダーセルに表示するイベント(予定)を扱うための型
 */
export type CalendarItem = {
  id: string;
  index: number;      // 同日内での上下位置
  color: string;      // バーの色
  text: string;       // バーに表示するテキスト
  /**
   * 1日だけ: 'all'
   * 開始日: 'start'
   * 終了日: 'end'
   * 途中日: 'between'
   */
  type: 'all' | 'start' | 'end' | 'between';
};