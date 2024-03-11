import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { PermissionGroup, PermissionName } from '../enum/permission.enum';
import { IJwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<{
      name: PermissionName;
      group: PermissionGroup;
    }>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const payload = context.switchToHttp().getRequest().user as IJwtPayload;

    if (
      payload.roles?.includes('dev') ||
      payload.roles?.includes('admin') ||
      payload.permissions?.includes(
        `${requiredPermissions.group}:${requiredPermissions.name}`,
      )
    ) {
      return true;
    } else {
      throw new ForbiddenException({
        message: 'ຫ້າມເຂົ້າເຖິງ. ທ່ານບໍ່ມີສິດໃນການເຂົ້າເຖິງຊັບພະຍາກອນນີ້.',
      });
    }
  }
}
