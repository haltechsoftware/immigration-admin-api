import { Body, Controller, Delete, Get, Post, Put, UseInterceptors } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Valibot } from "src/common/decorators/valibot/valibot.decorator";
import { MergeParamToBodyInterceptor } from "src/common/interceptor/merge-param-to-body/merge-param-to-body.interceptor";
import { CreateBannerCommand } from "./commands/impl/create.command";
import { Public } from "src/common/decorators/public.decorator";
import { CreateBannerHeroDto, CreateBannerHeroType } from "./dtos/create-banner.dto";
import { ValibotAsync } from "src/common/decorators/valibot/valibot-async.decorator";
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from "src/common/dtos/offset-base-paginate.dto";
import { GetAllBannerQuery } from "./queries/impl/get-all.banner";
import { QueryBannerDto, QueryBannerType } from "./dtos/query-banner.dto";
import { GetByIdDto, GetByIdDtoType } from "src/common/dtos/get-by-id.dto";
import { GetOneBannerQuery } from "./queries/impl/get-one.banner";
import { UpdateBannerDtoType, UpdateBannerHeroDto } from "./dtos/update-banner.dto";
import { UpdateBannerCommand } from "./commands/impl/updata.command";
import { FormDataRequest } from "nestjs-form-data";
import { PrivateTrueBannerCommand } from "./commands/impl/private-true.banner.command";
import { PrivateFalseBannerCommand } from "./commands/impl/private-false.banner.command";
import { RemoveBannerCommand } from "./commands/impl/remove-banner";

@Controller('api/banner-hero') 
export class BannerHeroController {
constructor(
    private _commandBus: CommandBus,
    private _queryBus: QueryBus,
){}

@Public()
@Post()
@UseInterceptors(MergeParamToBodyInterceptor)
@FormDataRequest()
async create(@ValibotAsync({schema: CreateBannerHeroDto}) input: CreateBannerHeroType){
    
    const result = await this._commandBus.execute<CreateBannerCommand>(new CreateBannerCommand(input))
    return { message: result}
}

//start update
@Put(':id')
@UseInterceptors(MergeParamToBodyInterceptor)
@FormDataRequest()
async update( 
  @ValibotAsync({schema: UpdateBannerHeroDto}) input: UpdateBannerDtoType,
  @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
){
    
    const result = await this._commandBus.execute<UpdateBannerCommand>(new UpdateBannerCommand( params.id, input))
    return { message: result}
}


@Put(':id/private-true')
@UseInterceptors(MergeParamToBodyInterceptor)
async privateTrue( 
  @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
){
    
    const result = await this._commandBus.execute<PrivateTrueBannerCommand>(new PrivateTrueBannerCommand( params.id))
    return { message: result}
}

@Put(':id/private-false')
@UseInterceptors(MergeParamToBodyInterceptor)
async privateFalse( 
  @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
){
    
    const result = await this._commandBus.execute<PrivateFalseBannerCommand>(new PrivateFalseBannerCommand( params.id))
    return { message: result}
}

@Get()
async get(
  @Valibot({ schema: QueryBannerDto, type: 'query' })
  query: QueryBannerType,
  @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
  filter: OffsetBasePaginateDtoType,
) {
  return await this._queryBus.execute<GetAllBannerQuery>(new GetAllBannerQuery(query, filter));
}

@Get(':id')
async findOne(
  @Valibot({ schema: GetByIdDto, type: 'params' })
  params: GetByIdDtoType
) {
  return await this._queryBus.execute<GetOneBannerQuery>(new GetOneBannerQuery(params.id));
}

//remove data
@Delete(':id/remove')
async remove(
  @Valibot({ schema: GetByIdDto, type: 'params' })
  params: GetByIdDtoType
) {
  
  return await this._commandBus.execute<RemoveBannerCommand>(new RemoveBannerCommand(params.id));
}

}