// import { ArrivalRegistrationService } from './arrival-registration.service';
import { Controller, Get, Param, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Public } from "src/common/decorators/public.decorator";
import ArrivalRegisterQuery from "./queries/impl/arrival.query";

@Controller('arrival')
export class ArrivalRegistrationController{

    constructor(
        private readonly queryBus: QueryBus,
      ) {}

    @Public()
    @Get()
    async arrivalRegister(@Query() params: any): Promise<any> {
        // const { start_date, end_date, entry_name } = params;

        return await this.queryBus.execute<ArrivalRegisterQuery>(
            new ArrivalRegisterQuery(params),
        );
    }

}