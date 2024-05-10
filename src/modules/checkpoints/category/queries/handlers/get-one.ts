import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { NotFoundException } from "@nestjs/common";
import { GetOneCheckpointCategoryCommand } from "../impl/get-one";

@QueryHandler(GetOneCheckpointCategoryCommand)
export class QueryGetOneCheckpointCategoryHandler implements IQueryHandler<GetOneCheckpointCategoryCommand> {
    constructor(
        private readonly _drizzle: DrizzleService
    ) { }
    async execute({ id, query: { lang } }: GetOneCheckpointCategoryCommand): Promise<any> {
        const res = await this._drizzle.db().query.checkpointCategories.findFirst({
            where: (fields, { eq }) => eq(fields.id, id),
            with: {
                translates: {
                    where: (fields, { eq }) => (lang ? eq(fields.lang, lang) : undefined),
                },
            },
        });

        if (!res)
            throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນແຂວງນີ້' });

        return {
            data: res
        };
    }
}