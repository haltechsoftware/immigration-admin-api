import { Controller, Delete, Get, Post, Put, UseInterceptors } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FormDataRequest } from "nestjs-form-data";
import { Valibot } from "src/common/decorators/valibot/valibot.decorator";
import { PermissionGroup, PermissionName } from '../../../common/enum/permission.enum';
import { Permissions } from 'src/common/decorators/permission.decorator';
import GetFeedbackByIdQuery from "./queries/impl/get-feedback-by-id.query";
import { QueryFeedbackDto, QueryFeedbackDtoType } from "./dto/query-feedback.dto";
import GetFeedbackQuery from "./queries/impl/get-feedback.query";
import { GetByIdDto, GetByIdDtoType } from "src/common/dtos/get-by-id.dto";
import { MergeDrizzleToReqInterceptor } from "src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor";
import { UpdatePublishedDto, UpdatePublishedDtoType } from "./dto/update-status.dto";
import UpdateStatusCommand from "./command/impl/update-status.command";
import DeleteFeedbackCommand from "./command/impl/delete-feedback.command";


@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  
  @Permissions(PermissionGroup.Feedback, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryFeedbackDto, type: 'query' })
    query: QueryFeedbackDtoType,
  ) {
    return await this.queryBus.execute<GetFeedbackQuery>(new GetFeedbackQuery(query));
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
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Put(':id/change-status')
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