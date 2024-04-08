import { Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FormDataRequest } from 'nestjs-form-data';
import { Public } from 'src/common/decorators/public.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { Output } from 'valibot';
import { UploadPassportImageCommand } from './commands/impl/upload-passport-image.command';
import { UploadVisaImageCommand } from './commands/impl/upload-visa-image.command';
import { UploadPassportImageDto } from './dtos/upload-passport-image.dto';
import { UploadVisaImageDto } from './dtos/upload-visa-image.dto';
import ArrivalRegisterQuery from './queries/impl/arrival.query';
import { Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import VerifyArrivalCodeCommand from './commands/impl/verify-arrival-code.command';
import { QueryArrivalDto, QueryArrivalDtoType } from './dto/query-arrival.dto';
import {
  VerifyArrivalCodeDto,
  VerifyArrivalCodeDtoType,
} from './dto/verify-arrival-code.dto';
import ArrivalRegisterQuery from './queries/impl/arrival.query';
import GetArrivalByIdQuery from './queries/impl/get-arrival-by-id.query';

@Controller('arrival')
export class ArrivalRegistrationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Public()
  @Post('upload-passport')
  @FormDataRequest()
  async uploadPassport(
    @Valibot({ schema: UploadPassportImageDto })
    dto: Output<typeof UploadPassportImageDto>,
  ): Promise<{ url: string }> {
    const url = await this.commandBus.execute<
      UploadPassportImageCommand,
      string
    >(new UploadPassportImageCommand(dto));

    return { url };
  }

  @Public()
  @Post('upload-visa')
  @FormDataRequest()
  async uploadVisa(
    @Valibot({ schema: UploadVisaImageDto })
    dto: Output<typeof UploadVisaImageDto>,
  ): Promise<{ url: string }> {
    const url = await this.commandBus.execute<UploadVisaImageCommand, string>(
      new UploadVisaImageCommand(dto),
    );

    return { url };
}

  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get()
  async arrivalRegister(
    @Valibot({ schema: QueryArrivalDto, type: 'query' })
    query: QueryArrivalDtoType,
  ) {
    return await this.queryBus.execute<ArrivalRegisterQuery>(
      new ArrivalRegisterQuery(query),
    );
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get(':id')
  async getArrivalById(
    @Valibot({ schema: GetByIdDto, type: 'params' }) { id }: GetByIdDtoType,
  ): Promise<any> {
    return await this.queryBus.execute<GetArrivalByIdQuery>(
      new GetArrivalByIdQuery(id),
    );
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post()
  async verifyCode(
    @Valibot({ schema: VerifyArrivalCodeDto }) body: VerifyArrivalCodeDtoType,
  ): Promise<any> {
    const result = await this.commandBus.execute<VerifyArrivalCodeCommand>(
      new VerifyArrivalCodeCommand(body),
    );

    return { message: result };
  }
}
