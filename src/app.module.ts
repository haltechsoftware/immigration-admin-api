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
import { SupabaseStorageModule } from './infrastructure/file-upload/supabase/supabase-storage.module';
import { BannerModules } from './modules/banners';
import { checkpointModules } from './modules/checkpoints';
import { contactModules } from './modules/contacts';
import { feedbackModules } from './modules/feedback';
import { fileAndDirectoryModules } from './modules/files_and_directories';
import { HotelModules } from './modules/hotels';
import { lawModules } from './modules/laws';
import { NewsModules } from './modules/news';
import { registrationModules } from './modules/registrations';
import { serviceModules } from './modules/services';
import { UserModules } from './modules/users';
import { visaModules } from './modules/visa';

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
    // NodeFileUploadModule,
    SupabaseStorageModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    DrizzleModule,
    ...UserModules,
    ...BannerModules,
    ...feedbackModules,
    ...HotelModules,
    ...NewsModules,
    ...visaModules,
    ...lawModules,
    ...checkpointModules,
    ...fileAndDirectoryModules,
    ...registrationModules,
    ...contactModules,
    ...serviceModules,
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
