export type ResponseBody = DayTimetable[];
export type Timestamp = number;
export type UnixInterval = number;

export interface DayTimetable {
  start_of_day: number; // Unixstamp seconds
  day_modifier: number;
  is_day_off: boolean;
  timeslots: Timeslot[];
}

export interface Timeslot {
  begin_at: any; // Unixstamp seconds
  end_at: any; // Unixstamp seconds
}

export interface Schedule {
  created_at: Timestamp; // Unixstamp required
  updated_at: Timestamp; // required
  begin_at: Timestamp; // required
  end_at: Timestamp; // required
}

export interface WorkHour {
  key?: string;
  is_day_off: boolean; // required
  open_interval: UnixInterval; // required
  close_interval: UnixInterval; // required
  weekday: number; // required
}
