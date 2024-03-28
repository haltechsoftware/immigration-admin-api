import { Global, Module } from '@nestjs/common';
import { SupabaseStorageProvider } from './supabase-storage.service';

@Global()
@Module({
  providers: [SupabaseStorageProvider],
  exports: [SupabaseStorageProvider],
})
export class SupabaseStorageModule {}
