import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import GetContactQuery from "../impl/get-contact.query";
import { contacts } from "src/modules/contacts/entities/contacts";
import { count } from "drizzle-orm";

@QueryHandler(GetContactQuery)
export class GetContactHandler implements IQueryHandler<GetContactQuery> {
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    paginate: { offset, limit },
  }: GetContactQuery): Promise<any> {
    const res = await this._drizzle.db().query.contacts.findMany({
        orderBy: (fields, operators) => operators.desc(fields.created_at),
        limit,
        offset,
      });
  
      const total = await this._drizzle
        .db()
        .select({ value: count() })
        .from(contacts)
  
      return {
        data: res,
        total: total[0].value,
      };
    }


}