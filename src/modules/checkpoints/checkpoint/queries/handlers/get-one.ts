import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { NotFoundException } from "@nestjs/common";
import { GetOneCheckpointCommand } from "../impl/get-one";

@QueryHandler(GetOneCheckpointCommand)
export class QueryGetOneCheckpointHandler implements IQueryHandler<GetOneCheckpointCommand> {
    constructor(
        private readonly _drizzle: DrizzleService
    ) { }
    async execute({ id, query: { lang } }: GetOneCheckpointCommand): Promise<any> {
        const res = await this._drizzle.db().query.checkpoints.findFirst({
            where: (fields, { eq }) => eq(fields.id, id),
            columns: { category_id: false, province_id: false, country_id: false },
            with: {
                translates: {
                    where: lang
                        ? (fields, operators) => operators.eq(fields.lang, lang)
                        : undefined,
                },
                category: {
                    with: {
                        translates: { where: lang ? (fields, operators) => operators.eq(fields.lang, lang) : undefined }
                    }
                },
                province: {
                    with: {
                        translates: { where: lang ? (fields, operators) => operators.eq(fields.lang, lang) : undefined }
                    }
                },
                country: {
                    with: {
                        provinces: {
                            columns: { country_id: false, province_id: false },
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

                        },
                        translates: { where: lang ? (fields, operators) => operators.eq(fields.lang, lang) : undefined }
                    }
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