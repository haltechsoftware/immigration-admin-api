import { Module } from '@nestjs/common';
import { LawController } from './law.controller';
import lawCommandHandlers from './command/handlers';
import { LawRepository } from './law.repository';
import lawQueryHandlers from './queries/handlers';

@Module({
  providers: [...lawCommandHandlers, ...lawQueryHandlers, LawRepository],
  controllers: [LawController],
})
export class LawModule {}
