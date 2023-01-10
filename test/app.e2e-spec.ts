import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import * as events from '../data/events.json';
import * as workhours from '../data/workhours.json';
import { DayTimetable, Timestamp } from 'src/lib/types';

describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('Post /getTimeSlots', () => {
    describe(`'20210509 ~ 20210511' 에 맞는 dayTimeTable 반환하여야함`, () => {
      it(`is_ignore_schedule: true, is_ignore_workhour: false, timezone: 'America/Anguilla' 에서 업무시간에 알맞은 값을 반환`, async () => {
        const mockData = {
          start_day_identifier: '20210509',
          days: 3,
          service_duration: 3600,
          timeslot_interval: 1800,
          is_ignore_schedule: true,
          is_ignore_workhour: false,
          timezone_identifier: 'America/Anguilla',
        };

        const hour = 60 * 60;
        const seoulTimestamp: Timestamp = 1620486000000 / 1000;
        const anguillaTimestamp = seoulTimestamp + hour * 13;
        const days = ['sun', 'mon', 'tue'];

        const response = await request(app.getHttpServer())
          .post('/getTimeSlots')
          .send(mockData)
          .expect(200);

        const dayTimeTables: DayTimetable[] = response.body;

        let dayIdx = 0;

        const oneDay: Timestamp = 60 * 60 * 24;

        for (const dayTimeTable of dayTimeTables) {
          const workHour = workhours.find(
            (workhour) => workhour.key === days[dayIdx],
          );

          expect(dayTimeTable.day_modifier).toBe(dayIdx);
          expect(dayTimeTable.is_day_off).toBe(workHour.is_day_off);
          expect(dayTimeTable.start_of_day).toBe(
            anguillaTimestamp + dayIdx * oneDay,
          );

          let idx = 0;

          for (const timeslot of dayTimeTable.timeslots) {
            const timeslotInterval = idx++ * mockData.timeslot_interval;
            const beginAt =
              dayTimeTable.start_of_day +
              workHour.open_interval +
              timeslotInterval;

            expect(timeslot.begin_at).toBe(beginAt);
            expect(timeslot.end_at).toBe(beginAt + mockData.service_duration);
          }

          dayIdx += 1;
        }
      });

      it('is_ignore_schedule: false 일경우 겹치는 날이 존재하는지 점검', async () => {
        const mockData = {
          start_day_identifier: '20210509',
          days: 2,
          service_duration: 3600,
          timeslot_interval: 1800,
          is_ignore_schedule: false,
          is_ignore_workhour: false,
          timezone_identifier: 'Asia/Seoul',
        };

        const seoulTimestamp: Timestamp = 1620486000000 / 1000;
        const days = ['sun', 'mon'];

        const response = await request(app.getHttpServer())
          .post('/getTimeSlots')
          .send(mockData)
          .expect(200);

        const dayTimeTables: DayTimetable[] = response.body;

        let dayIdx = 0;
        const oneDay: Timestamp = 60 * 60 * 24;

        for (const dayTimeTable of dayTimeTables) {
          const workHour = workhours.find(
            (workhour) => workhour.key === days[dayIdx],
          );

          expect(dayTimeTable.day_modifier).toBe(dayIdx);
          expect(dayTimeTable.is_day_off).toBe(workHour.is_day_off);
          expect(dayTimeTable.start_of_day).toBe(
            seoulTimestamp + dayIdx * oneDay,
          );

          for (const timeslot of dayTimeTable.timeslots) {
            for (const schedule of events) {
              expect(
                timeslot.begin_at >= schedule.begin_at &&
                  timeslot.end_at <= schedule.end_at,
              ).toBeFalsy();
            }
          }

          dayIdx += 1;
        }
      });

      it('is_ignore_schedule: true, is_ignore_workhour: true 일경우 타임슬롯은 하루시간이 다 포함되었어야함', async () => {
        const mockData = {
          start_day_identifier: '20210509',
          days: 1,
          service_duration: 4200,
          timeslot_interval: 2000,
          is_ignore_schedule: true,
          is_ignore_workhour: true,
          timezone_identifier: 'Asia/Seoul',
        };

        const seoulTimestamp: Timestamp = 1620486000000 / 1000;

        const response = await request(app.getHttpServer())
          .post('/getTimeSlots')
          .send(mockData)
          .expect(200);

        const dayTimeTable: DayTimetable = response.body[0];
        const { timeslots } = dayTimeTable;

        let idx = 0;

        for (const timeslot of timeslots) {
          const serviceStartTime =
            seoulTimestamp + idx * mockData.timeslot_interval;

          expect(timeslot.begin_at).toBe(serviceStartTime);
          expect(timeslot.end_at).toBe(
            serviceStartTime + mockData.service_duration,
          );

          idx += 1;
        }
      });
    });
  });
});
