import { SetMetadata } from '@nestjs/common';
import { PermissionGroup, PermissionName } from '../enum/permission.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (group: PermissionGroup, name: PermissionName) =>
  SetMetadata<string, { name: PermissionName; group: PermissionGroup }>(
    PERMISSIONS_KEY,
    { name, group },
  );
