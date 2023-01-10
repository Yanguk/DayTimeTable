export type ResponseBody = DayTimetable[];
export type Timestamp = number;

export interface DayTimetable {
  start_of_day: Timestamp;
  day_modifier: Timestamp;
  is_day_off: boolean;
  timeslots: Timeslot[];
}

export interface Timeslot {
  begin_at: Timestamp;
  end_at: Timestamp;
}

export interface Schedule {
  created_at: Timestamp;
  updated_at: Timestamp;
  begin_at: Timestamp;
  end_at: Timestamp;
}

export interface WorkHour {
  key?: string;
  is_day_off: boolean;
  open_interval: Timestamp;
  close_interval: Timestamp;
  weekday: number;
}
