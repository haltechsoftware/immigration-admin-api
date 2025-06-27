import { Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FormDataRequest } from 'nestjs-form-data';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { Output } from 'valibot';
import ScanArrivalCodeCommand from './commands/impl/scan-arrival-code.command';
import { UploadPassportImageCommand } from './commands/impl/upload-passport-image.command';
import { UploadVisaImageCommand } from './commands/impl/upload-visa-image.command';
import VerifyArrivalCodeCommand from './commands/impl/verify-arrival-code.command';
import { QueryArrivalDto, QueryArrivalDtoType } from './dto/query-arrival.dto';
import {
  VerifyArrivalCodeDto,
  VerifyArrivalCodeDtoType,
} from './dto/verify-arrival-code.dto';
import { UploadPassportImageDto } from './dtos/upload-passport-image.dto';
import { UploadVisaImageDto } from './dtos/upload-visa-image.dto';
import ArrivalRegisterQuery from './queries/impl/arrival.query';
import GetArrivalByIdQuery from './queries/impl/get-arrival-by-id.query';
import ArrivalRegistrationCommand from './commands/impl/arrival-registration.command';
import {
  ArrivalRegistrationDto,
  ArrivalRegistrationDtoType,
} from './dtos/arrival-registration.dto';
import {
  QueryPointClientDto,
  QueryPointClientDtoType,
} from './dto/get-point.dto';
import GetPointClientQuery from './queries/impl/get-point-client.query';
import GetCountryClientQuery from './queries/impl/get-country.query';
import checkCountryExceptVisaQuery from './queries/impl/check-country-except-visa.query';

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
  @Post()
  @FormDataRequest()
  async arrivalRegistration(
    @Valibot({ schema: ArrivalRegistrationDto })
    input: ArrivalRegistrationDtoType,
  ) {
    const res = await this.commandBus.execute<ArrivalRegistrationCommand>(
      new ArrivalRegistrationCommand(input),
    );
    return { message: res };
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

  @Public()
  @Get('point')
  async getPoint(
    @Valibot({ schema: QueryPointClientDto, type: 'query' })
    query: QueryPointClientDtoType,
  ) {
    return await this.queryBus.execute<GetPointClientQuery>(
      new GetPointClientQuery(query),
    );
  }

  @Public()
  @Get('countries')
  async getCountries(
    @Valibot({ schema: QueryPointClientDto, type: 'query' })
    query: QueryPointClientDtoType,
  ) {
    return await this.queryBus.execute<GetCountryClientQuery>(
      new GetCountryClientQuery(query),
    );
  }

  @Public()
  @Get('check-country-except-visa/:id')
  async checkCountryExceptVisa(
    @Valibot({ schema: GetByIdDto, type: 'params' }) { id }: GetByIdDtoType,
  ) {
    return await this.queryBus.execute<checkCountryExceptVisaQuery>(
      new checkCountryExceptVisaQuery(id),
    );
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
  @HttpCode(200)
  @Post('scan')
  async scanQR(
    @Valibot({ schema: VerifyArrivalCodeDto })
    body: VerifyArrivalCodeDtoType,
  ) {
    return await this.commandBus.execute<ScanArrivalCodeCommand>(
      new ScanArrivalCodeCommand(body),
    );
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Put(':id')
  async verifyCode(
    @Valibot({ schema: GetByIdDto, type: 'params' }) { id }: GetByIdDtoType,
  ): Promise<any> {
    const result = await this.commandBus.execute<VerifyArrivalCodeCommand>(
      new VerifyArrivalCodeCommand(id),
    );

    return { message: result };
  }
}
