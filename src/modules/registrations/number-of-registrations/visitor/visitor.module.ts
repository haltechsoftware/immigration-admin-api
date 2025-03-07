import { Module } from '@nestjs/common';
import { VisitorController } from './visitor.controller';
import VisitorCommandHandlers from './commands/handlers';
import VisitorQueryHandlers from './queries/handlers';

@Module({
  providers: [...VisitorQueryHandlers, ...VisitorCommandHandlers],
  controllers: [VisitorController],
})
export class VisitorModule {}
