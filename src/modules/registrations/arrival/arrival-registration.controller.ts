// import { ArrivalRegistrationService } from './arrival-registration.service';
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

@Controller('arrival')
export class ArrivalRegistrationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Public()
  @Get()
  async arrivalRegister(@Query() params: any): Promise<any> {
    // const { start_date, end_date, entry_name } = params;

    return await this.queryBus.execute<ArrivalRegisterQuery>(
      new ArrivalRegisterQuery(params),
    );
  }

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
}
