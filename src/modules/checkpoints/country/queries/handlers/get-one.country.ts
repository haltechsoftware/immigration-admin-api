import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { NotFoundException } from "@nestjs/common";
import { GetOneCountryCommand } from "../impl/get-one.country";

@QueryHandler(GetOneCountryCommand)
export class QueryGetOneCountryHandler implements IQueryHandler<GetOneCountryCommand> {
    constructor(
        private readonly _drizzle: DrizzleService
    ) { }
    async execute({ id, query: { lang } }: GetOneCountryCommand): Promise<any> {
        const res = await this._drizzle.db().query.countries.findFirst({
            where: (fields, { eq }) => eq(fields.id, id),
            with: {
                translates: {
                    where: (fields, { eq }) => (lang ? eq(fields.lang, lang) : undefined),
                },
                provinces: {
                    with: {
                        province: {
                            with: {
                                translates: {
                                    where: lang
                                        ? (fields, operators) => operators.eq(fields.lang, lang) : undefined,
                                }
                            }
                        }
                    }

                }
            },
        });

        if (!res)
            throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນແຂວງນີ້' });

        return {
            data: res
        };
    }
}