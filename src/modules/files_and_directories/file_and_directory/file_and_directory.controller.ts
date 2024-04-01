import { Controller, Delete, Get, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Valibot } from "src/common/decorators/valibot/valibot.decorator";
import { CreateDirectoryDto, CreateDirectoryDtoType } from "./dtos/create-directory.dto";
import { CreateDirectoryCommand } from "./commands/impl/create-directory.command";
import { FormDataRequest } from "nestjs-form-data";
import { GetByIdDto, GetByIdDtoType } from "src/common/dtos/get-by-id.dto";
import { GetAllFilesAndDirectoryQuery } from "./queries/impl/get-all.query";
import { PermissionGroup, PermissionName } from "src/common/enum/permission.enum";
import { Permissions } from 'src/common/decorators/permission.decorator';
import { GetListFileById } from "./queries/impl/get-list-file-by-id";
import { DeleteDirectoryCommand } from "./commands/impl/delete-directory.command";
import { DeleteFileCommand } from "./commands/impl/delete-file.command";
import { CreateFileDto, CreateFileDtoType } from "./dtos/create-File.dto";
import { CreateFilesCommand } from "./commands/impl/create-file.command";
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from "src/common/dtos/offset-base-paginate.dto";

@Controller('api/file_and_directory')
export class FileAndDirectoryController {
    constructor(
        private _commandBus: CommandBus,
        private _queryBus: QueryBus
    ) { }

    //create folder
    @Permissions(PermissionGroup.FileAndDirectory, PermissionName.Write)
    @FormDataRequest()
    @Post('create-directory')
    async createFolder(
        @Valibot({ schema: CreateDirectoryDto }) input: CreateDirectoryDtoType
    ) {
        const res = await this._commandBus.execute<CreateDirectoryCommand>(
            new CreateDirectoryCommand(input)
        )
        return { message: res }
    }

    //create file
    @Permissions(PermissionGroup.FileAndDirectory, PermissionName.Write)
    @FormDataRequest()
    @Post('create-file')
    async createFile(
        @Valibot({ schema: CreateFileDto }) input: CreateFileDtoType
    ) {
        const res = await this._commandBus.execute<CreateFilesCommand>(
            new CreateFilesCommand(input)
        )
        return { message: res }
    }

    //get one
    @Permissions(PermissionGroup.FileAndDirectory, PermissionName.Read)
    @Get(':id')
    async getByIdDirectory(
        @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    ) {
        return await this._queryBus.execute<GetListFileById>(
            new GetListFileById(params.id),
        );
    }
//get all
    @Permissions(PermissionGroup.FileAndDirectory, PermissionName.Read)
    @Get()
    async getByIdFile(
        @Valibot({ schema: OffsetBasePaginateDto, type: 'params' }) params: OffsetBasePaginateDtoType,
    ) {
        return await this._queryBus.execute<GetAllFilesAndDirectoryQuery>(
            new GetAllFilesAndDirectoryQuery(params),
        );
    }
    //deleted
    @Permissions(PermissionGroup.FileAndDirectory, PermissionName.Remove)
    @Delete(':id/delete-directory')
    async removeDirectory(
        @Valibot({ schema: GetByIdDto, type: 'params' })
        params: GetByIdDtoType,
    ) {
        const result = await this._commandBus.execute<DeleteDirectoryCommand>(
            new DeleteDirectoryCommand(params.id),
        );
        return { message: result };
    }

    @Permissions(PermissionGroup.FileAndDirectory, PermissionName.Remove)
    @Delete(':id/delete-file')
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