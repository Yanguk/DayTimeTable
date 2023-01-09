import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseBody, Schedule, Timeslot, WorkHour } from 'src/lib/types';
import {
  convertDateToTimeStamp,
  convertStringToDate,
  range,
} from 'src/lib/utils';
import { TimeSlotsDto } from './dto/TimeSlotsDto';
import { TimeSlotsService } from './time-slots.service';

@Controller()
export class TimeSlotsController {
  constructor(private timeSlotsService: TimeSlotsService) {}

  @Post('getTimeSlots')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTimeSlots(
    @Body() timeSlotsDto: TimeSlotsDto,
  ): Promise<ResponseBody> {
    const {
      start_day_identifier,
      timezone_identifier,
      timeslot_interval,
      service_duration,
      days,
      is_ignore_schedule,
      is_ignore_workhour,
    } = timeSlotsDto;

    const startDate: Date = convertStringToDate(start_day_identifier);
    const startTimestamp = convertDateToTimeStamp(startDate);
    const oneDay = 60 * 60 * 24;

    const dayTimeTables: ResponseBody = range(days)
      .map((idx) => startTimestamp + idx * oneDay)
      .map((timeStamp, idx) => {
        const timeslots = [];

        const startTime = timeStamp;
        const endTime = timeStamp + oneDay;

        let intervalTime = startTime;

        while (intervalTime + service_duration <= endTime) {
          const timeslot: Timeslot = {
            begin_at: intervalTime,
            end_at: intervalTime + service_duration,
          };

          timeslots.push(timeslot);
          intervalTime += timeslot_interval;
        }

        return {
          start_of_day: timeStamp,
          day_modifier: idx,
          is_day_off: false,
          timeslots,
        };
      });

    return dayTimeTables;
  }
}
