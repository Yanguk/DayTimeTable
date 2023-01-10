import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ResponseBody,
  Schedule,
  Timeslot,
  Timestamp,
  WorkHour,
} from 'src/lib/types';
import { convertStringToTimeStamp, range } from 'src/lib/utils';
import { TimeSlotsDto } from './dto/TimeSlotsDto';
import { TimeSlotsService } from './time-slots.service';

@Controller()
export class TimeSlotsController {
  constructor(private timeSlotsService: TimeSlotsService) {}

  @Post('getTimeSlots')
  @HttpCode(200)
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

    const utcTimeStamp: Timestamp =
      convertStringToTimeStamp(start_day_identifier);

    const { format } = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: timezone_identifier,
    });

    const gmtTime: string = format(utcTimeStamp * 1000)
      .split(' ')
      .slice(-1)[0]
      .slice(3);

    const oneHour: Timestamp = 60 * 60;
    const oneDay: Timestamp = oneHour * 24;

    const startTimestamp: Timestamp = utcTimeStamp - Number(gmtTime) * oneHour;

    const dayTimeTables: ResponseBody = range(days)
      .map((idx) => startTimestamp + idx * oneDay)
      .map((timeStamp, idx) => ({
        start_of_day: timeStamp,
        day_modifier: idx,
        is_day_off: false,
        timeslots: [],
      }));

    if (!is_ignore_workhour) {
      const workTableMap = new Map<string, WorkHour>();
      const workHours: WorkHour[] = await this.timeSlotsService.getWorkHours();
      workHours.forEach((workHour) => workTableMap.set(workHour.key, workHour));

      dayTimeTables.forEach((timeTable) => {
        const targetDay: string = format(timeTable.start_of_day * 1000)
          .slice(0, 3)
          .toLowerCase();

        const targetWorkHour: WorkHour = workTableMap.get(targetDay);

        timeTable.is_day_off = targetWorkHour.is_day_off;

        const startTime = timeTable.start_of_day + targetWorkHour.open_interval;
        const endTime = timeTable.start_of_day + targetWorkHour.close_interval;

        let intervalTime = startTime;

        while (intervalTime + service_duration <= endTime) {
          const timeslot: Timeslot = {
            begin_at: intervalTime,
            end_at: intervalTime + service_duration,
          };

          timeTable.timeslots.push(timeslot);
          intervalTime += timeslot_interval;
        }
      });
    } else {
      dayTimeTables.forEach((timeTable) => {
        const startTime = timeTable.start_of_day;
        const endTime = timeTable.start_of_day + oneDay;

        let intervalTime = startTime;

        while (intervalTime + service_duration <= endTime) {
          const timeslot: Timeslot = {
            begin_at: intervalTime,
            end_at: intervalTime + service_duration,
          };

          timeTable.timeslots.push(timeslot);
          intervalTime += timeslot_interval;
        }
      });
    }

    if (!is_ignore_schedule) {
      const schedules: Schedule[] = await this.timeSlotsService.getEvents();

      const isNotInScheduleDate = (timeslot: Timeslot) => {
        for (const schedule of schedules) {
          if (
            !(
              timeslot.end_at < schedule.begin_at ||
              timeslot.begin_at > schedule.end_at
            )
          ) {
            return false;
          }
        }

        return true;
      };

      dayTimeTables.forEach((timeTable) => {
        timeTable.timeslots = timeTable.timeslots.filter(isNotInScheduleDate);
      });
    }

    return dayTimeTables;
  }
}
