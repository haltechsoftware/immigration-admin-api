import { Module } from '@nestjs/common';
import { NationalityController } from './notionality.controller';
import nationalityCommandHandlers from './commands/handler';
import nationalityQueryHandlers from './queries/handler';
import { NationalityRepository } from './nationality.repository';

@Module({
  providers: [
    ...nationalityCommandHandlers,
    ...nationalityQueryHandlers,
    NationalityRepository,
  ],
  controllers: [NationalityController],
})
export class NationalityModule {}
