import { param } from 'drizzle-orm';
// import { ArrivalRegistrationService } from './arrival-registration.service';
import { Controller, Get, Param, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Public } from "src/common/decorators/public.decorator";
import ArrivalRegisterQuery from "./queries/impl/arrival.query";
import GetArrivalByIdQuery from './queries/impl/get-arrival-by-id.query';

@Controller('arrival')
export class ArrivalRegistrationController{

    constructor(
        private readonly queryBus: QueryBus,) {}

    @Public()
    @Get()
    async arrivalRegister(@Query() params: any): Promise<any> {

        return await this.queryBus.execute<ArrivalRegisterQuery>(
            new ArrivalRegisterQuery(params),
        );
    }
    @Public()
    @Get(':id')
    async getArrivalById(@Param('id') id: number): Promise<any> {
        return await this.queryBus.execute<GetArrivalByIdQuery>(
            new GetArrivalByIdQuery(id)
        );
    }
}