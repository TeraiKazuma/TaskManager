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
  