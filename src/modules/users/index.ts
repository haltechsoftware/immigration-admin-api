import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permissions/permission.module';
import { RoleModule } from './roles/role.module';
import { UserModule } from './users/user.module';

export const UserModules = [
  AuthModule,
  PermissionModule,
  RoleModule,
  UserModule,
];
