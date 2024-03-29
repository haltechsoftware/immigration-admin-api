import { Controller, Get, Param } from "@nestjs/common";
import { QueryBus } from '@nestjs/cqrs';
import { Public } from "src/common/decorators/public.decorator";
import ArrivalRegisterQuery from "./queries/impl/arrival.query";
import GetArrivalByIdQuery from './queries/impl/get-arrival-by-id.query';
import { Valibot } from "src/common/decorators/valibot/valibot.decorator";
import { QueryArrivalDto, QueryArrivalDtoType } from "./dto/query-arrival.dto";

@Controller('arrival')
export class ArrivalRegistrationController{
    constructor(
        private readonly queryBus: QueryBus,) {}

    @Public()
    @Get()
    async arrivalRegister(
        @Valibot({ schema: QueryArrivalDto, type: 'query'}) 
        query: QueryArrivalDtoType,
    ) {
        return await this.queryBus.execute<ArrivalRegisterQuery>(new ArrivalRegisterQuery(query));
    }
    
    @Public()
    @Get(':id')
    async getArrivalById(@Param('id') id: number): Promise<any> {
        return await this.queryBus.execute<GetArrivalByIdQuery>(
            new GetArrivalByIdQuery(id)
        );
    }
}