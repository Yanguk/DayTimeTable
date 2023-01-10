import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Schedule, WorkHour } from 'src/lib/types';

@Injectable()
export class TimeSlotsService {
  async getEvents(): Promise<Schedule[]> {
    const eventsJSON: string = await readFile(
      join(process.cwd(), 'data/events.json'),
      'utf8',
    );

    return JSON.parse(eventsJSON);
  }

  async getWorkHours(): Promise<WorkHour[]> {
    const workHoursJSON: string = await readFile(
      join(process.cwd(), 'data/workhours.json'),
      'utf8',
    );

    return JSON.parse(workHoursJSON);
  }
}
