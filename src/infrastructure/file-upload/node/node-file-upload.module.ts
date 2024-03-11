import { Global, Module } from '@nestjs/common';
import { NodeFileUploadService } from './node-file-upload.service';

@Global()
@Module({
  providers: [NodeFileUploadService],
  exports: [NodeFileUploadService],
})
export class NodeFileUploadModule {}
