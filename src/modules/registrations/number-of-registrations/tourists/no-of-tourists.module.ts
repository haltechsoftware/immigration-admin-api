import { Module } from '@nestjs/common';
import NoOfTouristCommandHandlers from './commands/handlers';
import { NoOfTouristsController } from './no-of-tourists.controller';
import NoOfTouristQueryHandlers from './queries/handlers';

@Module({
  providers: [...NoOfTouristQueryHandlers, ...NoOfTouristCommandHandlers],
  controllers: [NoOfTouristsController],
})
export class NoOfTouristsModule {}
