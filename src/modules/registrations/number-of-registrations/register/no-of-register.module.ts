import { Module } from '@nestjs/common';
import NoOfRegisterCommandHandlers from './commands/handlers';
import { NoOfRegisterController } from './no-of-register.controller';
import NoOfRegisterQueryHandlers from './queries/handlers';

@Module({
  providers: [...NoOfRegisterQueryHandlers, ...NoOfRegisterCommandHandlers],
  controllers: [NoOfRegisterController],
})
export class NoOfRegisterModule {}
