import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FormDataRequest } from 'nestjs-form-data';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from '../../../common/enum/permission.enum';
import DeleteFeedbackCommand from './command/impl/delete-feedback.command';
import UpdateStatusCommand from './command/impl/update-status.command';
import { UploadFeedbackMediaCommand } from './command/impl/upload-feedback-media.command';
import {
  QueryFeedbackDto,
  QueryFeedbackDtoType,
} from './dto/query-feedback.dto';
import {
  UpdatePublishedDto,
  UpdatePublishedDtoType,
} from './dto/update-status.dto';
import {
  UploadFeedbackMediaDto,
  UploadFeedbackMediaDtoType,
} from './dto/upload-feedback-media.dto';
import GetFeedbackByIdQuery from './queries/impl/get-feedback-by-id.query';
import GetFeedbackQuery from './queries/impl/get-feedback.query';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Public()
  @Post('upload-media')
  @FormDataRequest()
  async uploadMedia(
    @Valibot({ schema: UploadFeedbackMediaDto })
    dto: UploadFeedbackMediaDtoType,
  ): Promise<{ url: string }> {
    const url = await this.commandBus.execute<
      UploadFeedbackMediaCommand,
      string
    >(new UploadFeedbackMediaCommand(dto));

    return { url };
  }

  @Permissions(PermissionGroup.Feedback, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryFeedbackDto, type: 'query' })
    query: QueryFeedbackDtoType,
  ) {
    return await this.queryBus.execute<GetFeedbackQuery>(
      new GetFeedbackQuery(query),
    );
  }

  @Permissions(PermissionGroup.Feedback, PermissionName.Read)
  @Get(':id')
  async getById(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this.queryBus.execute<GetFeedbackByIdQuery>(
      new GetFeedbackByIdQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.Feedback, PermissionName.Write)
  @Put(':id')
  async updatePrivate(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    @Valibot({ schema: UpdatePublishedDto })
    body: UpdatePublishedDtoType,
  ) {
    const res = await this.commandBus.execute<UpdateStatusCommand>(
      new UpdateStatusCommand(params.id, body),
    );

    return { message: res };
  }

  @Permissions(PermissionGroup.Feedback, PermissionName.Remove)
  @Delete(':id')
  async delete(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const res = await this.commandBus.execute<DeleteFeedbackCommand>(
      new DeleteFeedbackCommand(params.id),
    );

    return { message: res };
  }
}
