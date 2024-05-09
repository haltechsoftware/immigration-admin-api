import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { contacts } from 'src/modules/contacts/entities/contacts';
import GetContactQuery from '../impl/get-contact.query';

@QueryHandler(GetContactQuery)
export class GetContactHandler implements IQueryHandler<GetContactQuery> {
  constructor(private readonly _drizzle: DrizzleService) {}

  private prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(contacts)
    .prepare();

  async execute({
    paginate: { offset, limit },
  }: GetContactQuery): Promise<any> {
    const res = await this._drizzle.db().query.contacts.findMany({
      orderBy: (fields, operators) => operators.desc(fields.created_at),
      limit,
      offset,
    });

    const total = await this.prepared.execute();

    return {
      data: res,
      total: total[0].value,
    };
  }
}
