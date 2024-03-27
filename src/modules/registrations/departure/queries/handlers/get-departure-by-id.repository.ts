import { sql } from 'drizzle-orm';
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import GetDepartureByIdQuery from "../impl/get-departure-by-id.query";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";

@QueryHandler(GetDepartureByIdQuery)
export class GetDepartureByIdHandler implements IQueryHandler<GetDepartureByIdQuery> {
    constructor(private readonly drizzle: DrizzleService) {}

    private prepared = this.drizzle
    .db()
    .query.departureRegistration.findFirst({
        where: (fields, {eq}) => eq(fields.id, sql.placeholder('id')),
        with: {
            passport_information: true,
            personal_information: true
        }
    })
    .prepare('get_departure_by_id');

    async execute({ id }: GetDepartureByIdQuery) {
        const res = await this.prepared.execute({ id });

        return {
            data: res,
        }
    }
}