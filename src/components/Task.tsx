// Task.ts
/**
 * Python(Flask) サーバーから取得するタスクデータの型
 * 例:
 * [
 *   {
 *     "id": 1,
 *     "title": "会議",
 *     "kind": "business",
 *     "startdate": "2025-01-10",
 *     "enddate": "2025-01-10",
 *     "starttime": "09:00",
 *     "endtime": "10:00",
 *     "place": "本社",
 *     "notice": 2,
 *     "url": "...",
 *     "memo": "..."
 *   },
 *   ...
 * ]
 */
export interface Task {
    id: number;
    title: string;
    kind: string;
    startdate: string;   // "2025-01-10" など
    enddate: string;     // "2025-01-11" など
    starttime: string;
    endtime: string;
    place: string;
    notice: number;
    url?: string;
    memo?: string;
  }
  