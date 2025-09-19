export interface WorkRecord {
  readonly id: string;
  readonly user_id: string;
  readonly day: number;
  readonly process: string;
  readonly code: string;
  readonly date: string;
  readonly createdAt: string;
}

export interface CreateRecordData {
  readonly day: number;
  readonly process: string;
  readonly code: string;
}

export interface RecordStats {
  readonly totalRecords: number;
  readonly workingDays: number;
  readonly recordsByDay: Record<number, number>;
}

export interface DaySeparator {
  readonly type: "separator";
  readonly dayId: number;
  readonly dayName: string;
}

export type ReorderItem = WorkRecord | DaySeparator;

export interface RecordsHookReturn {
  readonly records: WorkRecord[];
  readonly getRecordsForDay: (dayId: number) => WorkRecord[];
  readonly findRecordsByCode: (code: string) => WorkRecord[];
  readonly getRecordsByProcess: (process: string) => WorkRecord[];
  readonly stats: RecordStats;
  readonly addRecord: (data: CreateRecordData) => WorkRecord | null;
  readonly deleteRecord: (recordId: string) => boolean;
  readonly reorderRecords: (newOrder: ReorderItem[]) => void;
  readonly clearAllRecords: () => void;
}
