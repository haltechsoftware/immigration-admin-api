import { Module } from '@nestjs/common';
import { roleCommandHandlers } from './commands/handlers';
import roleQueryHandlers from './quries/handlers';
import { RoleRepository } from './repositories/role.repository';
import { RoleController } from './role.controller';

@Module({
  providers: [...roleCommandHandlers, ...roleQueryHandlers, RoleRepository],
  controllers: [RoleController],
})
export class RoleModule {}
