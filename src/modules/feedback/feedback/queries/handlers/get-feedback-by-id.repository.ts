import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import GetFeedbackByIdQuery from "../impl/get-feedback-by-id.query";
import { sql } from "drizzle-orm";
import { NotFoundException } from "@nestjs/common";

@QueryHandler(GetFeedbackByIdQuery)
export class GetFeedbackByIdHandler implements IQueryHandler<GetFeedbackByIdQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.feedbacks.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare('get_popup_by_id');

    async execute({id}: GetFeedbackByIdQuery): Promise<any> {
        const res = await this.prepared.execute({ id });

        if (!res) throw new NotFoundException({ message: 'ຟີກເບັກບໍ່ມີໃນລະບົບ' });
    
        return res;
    }
}