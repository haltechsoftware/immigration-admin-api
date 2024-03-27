import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Param, Query } from "@nestjs/common";
import { Public } from 'src/common/decorators/public.decorator';
import DepartureRegisterQuery from './queries/impl/departure.query';
import GetDepartureByIdQuery from './queries/impl/get-departure-by-id.query';

@Controller('departure')
export class DepartureRegistrationController {

    constructor(private readonly queryBus: QueryBus) {}
    
    @Public()
    @Get()
    async departureRegister(@Query() params: any): Promise<any> {

        return await this.queryBus.execute<DepartureRegisterQuery>(
            new DepartureRegisterQuery(params),
        );
    }

    @Public()
    @Get(':id')
    async GetDepartureByIdHandler(@Param('id') id : number): Promise<any> {
        return await this.queryBus.execute<GetDepartureByIdQuery>(
            new GetDepartureByIdQuery(id)
        )
    }
}