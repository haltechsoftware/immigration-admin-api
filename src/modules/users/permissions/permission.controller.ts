import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import GetPermissionsQuery from './queries/impl/get-permission.query';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Permissions(PermissionGroup.User, PermissionName.Read)
  @Get()
  async get() {
    return await this.queryBus.execute(new GetPermissionsQuery());
  }
}
