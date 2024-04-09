import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FormDataRequest } from 'nestjs-form-data';
import { ValibotAsync } from 'src/common/decorators/valibot/valibot-async.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import { MergeDrizzleToReqInterceptor } from 'src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor';
import { CreateDirectoryCommand } from './commands/impl/create-directory.command';
import { CreateFilesCommand } from './commands/impl/create-file.command';
import { DeleteDirectoryCommand } from './commands/impl/delete-directory.command';
import { DeleteFileCommand } from './commands/impl/delete-file.command';
import {
  CreateDirectoryDto,
  CreateDirectoryDtoType,
} from './dtos/create-directory.dto';

import { MergeParamToBodyInterceptor } from 'src/common/interceptor/merge-param-to-body/merge-param-to-body.interceptor';
import { RenameDirectoryCommand } from './commands/impl/rename-directory.command';
import { CreateFileDto, CreateFileDtoType } from './dtos/create-file.dto';
import {
  QueryFileAndFolderByParentIdDto,
  QueryFileAndFolderByParentIdDtoType,
} from './dtos/query-file-and-folder-by-parent-id.dto';
import {
  RenameDirectoryDto,
  RenameDirectoryDtoType,
  RenameDirectoryParamDto,
  RenameDirectoryParamDtoType,
} from './dtos/rename-directory.dto';
import { GetFileAndFolderByParentIdQuery } from './queries/impl/get-file-and-folder-by-parent-id.query';

@Controller('file-and-directory')
export class FileAndDirectoryController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Post('directory')
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  async createFolder(
    @ValibotAsync({ schema: CreateDirectoryDto }) input: CreateDirectoryDtoType,
  ) {
    const res = await this._commandBus.execute<CreateDirectoryCommand>(
      new CreateDirectoryCommand(input),
    );
    return { message: res };
  }

  @FormDataRequest()
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Post('file')
  async createFile(
    @ValibotAsync({ schema: CreateFileDto }) input: CreateFileDtoType,
  ) {
    const res = await this._commandBus.execute<CreateFilesCommand>(
      new CreateFilesCommand(input),
    );
    return { message: res };
  }

  @Get()
  async getFileAndFolder(
    @Valibot({ schema: QueryFileAndFolderByParentIdDto, type: 'query' })
    query: QueryFileAndFolderByParentIdDtoType,
  ) {
    return await this._queryBus.execute<GetFileAndFolderByParentIdQuery>(
      new GetFileAndFolderByParentIdQuery(query),
    );
  }

  @UseInterceptors(MergeParamToBodyInterceptor, MergeDrizzleToReqInterceptor)
  @Put(':id/directory')
  async renameDirectory(
    @Valibot({ schema: RenameDirectoryParamDto })
    { id }: RenameDirectoryParamDtoType,
    @ValibotAsync({ schema: RenameDirectoryDto })
    body: RenameDirectoryDtoType,
  ) {
    const result = await this._commandBus.execute<RenameDirectoryCommand>(
      new RenameDirectoryCommand(id, body),
    );
    return { message: result };
  }

  @Delete(':id/directory')
  async removeDirectory(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<DeleteDirectoryCommand>(
      new DeleteDirectoryCommand(params.id),
    );
    return { message: result };
  }

  @Delete(':id/file')
  async removeFile(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<DeleteFileCommand>(
      new DeleteFileCommand(params.id),
    );
    return { message: result };
  }
}
