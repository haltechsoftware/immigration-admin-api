import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import permissionQueryHandlers from './queries/handlers';

@Module({
  controllers: [PermissionController],
  providers: [...permissionQueryHandlers],
})
export class PermissionModule {}
