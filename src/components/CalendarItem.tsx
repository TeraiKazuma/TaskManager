// CalendarItem.ts
// カレンダーセルに表示するタスクの型を定義したファイルです。

// カレンダーセルに表示するタスクを扱うための型
export type CalendarItem = {
  id: string;
  index: number;      // 同日内での上下位置
  color: string;      // タスクバーの色
  text: string;       // タスクバーに表示するテキスト
  type: 'all' | 'start' | 'end' | 'between';//　日をまたぐタスクの場合、その日の役割(all / start / end / between)を分担
};
