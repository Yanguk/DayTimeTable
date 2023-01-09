import { Controller, Post } from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';

@Controller()
export class TimeSlotsController {
  constructor(private timeSlotsService: TimeSlotsService) {}

  @Post("getTimeSlots")
  getTimeSlots() {
    return "hello";
  }
}
