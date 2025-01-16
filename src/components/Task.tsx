// Task.tsx
// タスクを扱う際の型定義ファイル。
// API通信やDB側のレコードと相互にやり取りする目的で作成。

export interface Task {
  id: number;
  title: string;
  kind: string;
  startdate: string;
  enddate: string;
  starttime: string;
  endtime: string;
  place: string;
  notice: number;
  url?: string;
  memo?: string;
}
