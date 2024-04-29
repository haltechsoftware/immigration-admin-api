import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { GetOneProvinceCommand } from "../impl/get-one.province";

@QueryHandler(GetOneProvinceCommand)
export class QueryGetOneProvinceHandler implements IQueryHandler<GetOneProvinceCommand>{
    constructor(
        private readonly _drizzle: DrizzleService
    ){}
    async execute({id}: GetOneProvinceCommand): Promise<any> {
        return
    }
}