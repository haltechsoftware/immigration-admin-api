import { Module } from '@nestjs/common';
import { lostPassportHandlers } from './commands/handlers';
import { LostPassportController } from './lost_passport.controller';
import { LostPassportRepository } from './lost_passport.repository';
import { lostPassportQuery } from './queries/handlers';

@Module({
  controllers: [LostPassportController],
  providers: [
    LostPassportRepository,
    ...lostPassportHandlers,
    ...lostPassportQuery,
  ],
})
export class LostPassportModule {}
