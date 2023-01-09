import { Module } from '@nestjs/common';
import { TimeSlotsModule } from './time-slots/time-slots.module';

@Module({
  imports: [TimeSlotsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
