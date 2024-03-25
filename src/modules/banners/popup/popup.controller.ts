import { Controller, Delete, Get, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FormDataRequest } from 'nestjs-form-data';
import { MergeDrizzleToReqInterceptor } from 'src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor';
import { CreatePopupDto, CreatePopupDtoType } from './dto/create-popup.dto';
import CreatePopupCommand from './command/impl/create-popup.command';
import { Valibot } from '../../../common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import { UpdatePopupDto, UpdatePopupDtoType } from './dto/update-popup.dto';
import UpdatePopupCommand from './command/impl/update-popup.command';
import GetPopupByIdQuery from './queries/impl/get-popup-by-id.query';
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from 'src/common/dtos/offset-base-paginate.dto';
import GetPopupQuery from './queries/impl/get-popup.query';
import DeletePopupCommand from './command/impl/delete-popup.command';
import UpdatePrivatePopupCommand from './command/impl/update-private-popup.command';
import { UpdatePrivatePopupDto, UpdatePrivatePopupDtoType } from './dto/update-private.dto';
import { ValibotAsync } from 'src/common/decorators/valibot/valibot-async.decorator';
import { IOffsetBasePaginate } from 'src/common/interface/pagination/pagination.interface';
import { BannerPopup } from '../entities';
import GetReportPopupQuery from './queries/impl/report-popup.query';

@Controller('popup')
export class PopupController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('get-all')
  async get(
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    query: OffsetBasePaginateDtoType,
  ) {
    return await this.queryBus.execute<GetPopupQuery>(new GetPopupQuery(query));
  }

  @Get('report')
  async getReport(@Query() query
  ): Promise<any> {
    return await this.queryBus.execute<GetReportPopupQuery, IOffsetBasePaginate<BannerPopup>>(new GetReportPopupQuery(query));
  }

  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @FormDataRequest()
  @Post('create')
  async create(
    @Valibot({ schema: CreatePopupDto }) body: CreatePopupDtoType,
  ) {
    const res = await this.commandBus.execute<CreatePopupCommand>(
      new CreatePopupCommand(body),
    );

    return { message: res };
  }

  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @FormDataRequest()
  @Put('update/:id')
  async update(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    @Valibot({ schema: UpdatePopupDto }) body: UpdatePopupDtoType,
  ) {
    const res = await this.commandBus.execute<UpdatePopupCommand>(
      new UpdatePopupCommand(params.id, body),
    );

    return { message: res };
  }

  @Get('get/:id')
  async getById(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this.queryBus.execute<GetPopupByIdQuery>(
      new GetPopupByIdQuery(params.id),
    );
  }

  @Delete('delete/:id')
  async delete(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const res = await this.commandBus.execute<DeletePopupCommand>(
      new DeletePopupCommand(params.id),
    );

    return { message: res };
  }

  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @FormDataRequest()
  @Put('update-private/:id')
  async updatePrivate(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    @ValibotAsync({ schema: UpdatePrivatePopupDto }) body: UpdatePrivatePopupDtoType,
  ) {
    const res = await this.commandBus.execute<UpdatePrivatePopupCommand>(
      new UpdatePrivatePopupCommand(params.id, body),
    );

    return { message: res };
  }
}
