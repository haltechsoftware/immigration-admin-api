import { Controller, Delete, Get, Post, UseInterceptors } from '@nestjs/common';
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
import { CreateFileDto, CreateFileDtoType } from './dtos/create-File.dto';
import {
  QueryFileAndDirectoryDto,
  QueryFileAndDirectoryDtoType,
} from './dtos/query-file-and-directory.dto';
import { GetAllFilesAndDirectoryQuery } from './queries/impl/get-all.query';

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
  async getByIdFile(
    @Valibot({ schema: QueryFileAndDirectoryDto, type: 'query' })
    params: QueryFileAndDirectoryDtoType,
  ) {
    return await this._queryBus.execute<GetAllFilesAndDirectoryQuery>(
      new GetAllFilesAndDirectoryQuery(params),
    );
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
