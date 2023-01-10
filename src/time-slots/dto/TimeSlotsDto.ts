import { IsBoolean, IsNumber, IsString, Min } from 'class-validator';

export class TimeSlotsDto {
  @IsString()
  start_day_identifier: string;

  @IsString()
  timezone_identifier: string;

  @IsNumber()
  @Min(0)
  service_duration: number;

  @IsNumber()
  @Min(1)
  days?: number = 1;

  @IsNumber()
  @Min(0)
  timeslot_interval?: number = 1800;

  @IsBoolean()
  is_ignore_schedule?: boolean = false;

  @IsBoolean()
  is_ignore_workhour?: boolean = false;
}
