import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetListFileById } from "../impl/get-list-file-by-id";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { NotFoundException } from "@nestjs/common";
import { sql } from "drizzle-orm";

@QueryHandler(GetListFileById)
export class GetListFileByIdHandler implements IQueryHandler<GetListFileById> {
    constructor(
        private readonly drizzle: DrizzleService
    ) { }

    private _prepared = this.drizzle
        .db()
        .query.filesAndDirectories.findFirst({
            where: (fields, { eq, and }) => and(
                eq(fields.id, sql.placeholder('id'))
            ),
            with: {directory: true}
        })
        .prepare('get_file_by_id');
    async execute({ id }: GetListFileById) {
        const res = await this._prepared.execute({ id });

        if (!res)
            throw new NotFoundException({ message: 'ຟາຍ ຫຼື ໂຟເດີ້ນີ້ບໍ່ມີໃນລະບົບ' });
        return res
    }

}