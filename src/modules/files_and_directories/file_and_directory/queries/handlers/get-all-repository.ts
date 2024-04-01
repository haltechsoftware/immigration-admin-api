import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllFilesAndDirectoryQuery } from "../impl/get-all.query";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { count, sql } from "drizzle-orm";
import { NotFoundException } from "@nestjs/common";
import { filesAndDirectories } from "src/modules/files_and_directories/entities";

@QueryHandler(GetAllFilesAndDirectoryQuery)
export class GetAllFilesAndDirectorydHandler implements IQueryHandler<GetAllFilesAndDirectoryQuery> {
    constructor(
        private readonly drizzle: DrizzleService
    ) { }

    private _prepared = this.drizzle
        .db()
        .select({ value: count() })
        .from(filesAndDirectories)
        .prepare('count_users');

    async execute({ input: { offset, limit } }: GetAllFilesAndDirectoryQuery) {
        const res = await this.drizzle.db().query.filesAndDirectories.findMany({
          
            limit,
            offset,
        });
        const total = await this._prepared.execute();
        return {
            data: res,
            total: total[0].value,
        };
    }

}