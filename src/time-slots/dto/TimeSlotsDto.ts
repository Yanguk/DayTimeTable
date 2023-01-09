import { IsNumber, IsString } from "class-validator";

export class TimeSlotsDto {
  @IsString()
  start_day_identifier: string;

  @IsString()
  timezone_identifier: string;

  @IsNumber()
  service_duration: number;

  days?: number = 1;
  timeslot_interval?: number = 1800;
  is_ignore_schedule?: boolean = false;
  is_ignore_workhour?: boolean = false;
}
