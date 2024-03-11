import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { RequestContextModule } from 'nestjs-request-context';
import { join } from 'path';
import { AuthGuard } from './common/guards/auth.guard';
import { PermissionsGuard } from './common/guards/permission.guard';
import IEnv from './common/interface/env.interface';
import { DrizzleModule } from './infrastructure/drizzle/drizzle.module';
import { NodeFileUploadModule } from './infrastructure/file-upload/node/node-file-upload.module';
import { UserModules } from './modules/users';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    CqrsModule.forRoot(),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (config: ConfigService<IEnv>) => ({
        secret: config.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    NestjsFormDataModule.config({ isGlobal: true }),
    RequestContextModule,
    NodeFileUploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    DrizzleModule,
    ...UserModules,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
