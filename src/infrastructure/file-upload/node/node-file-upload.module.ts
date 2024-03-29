import { Global, Module } from '@nestjs/common';
import { NodeFileUploadProvider } from './node-file-upload.service';

@Global()
@Module({
  providers: [NodeFileUploadProvider],
  exports: [NodeFileUploadProvider],
})
export class NodeFileUploadModule {}
