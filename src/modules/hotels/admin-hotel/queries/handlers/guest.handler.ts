import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GuestQuery } from '../impl/guest.query';

@QueryHandler(GuestQuery)
export class GuestHandler implements IQueryHandler<GuestQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ id }: GuestQuery): Promise<any> {
    return await this.drizzle.db().query.intendedAddress.findFirst({
      columns: {
        id: true,
        check_in: true,
        check_out: true,
        room_no: true,
      },
      with: {
        arrival_registration: {
          columns: { id: true },
          with: {
            personal_information: true,
            passport_information: true,
            visa_information: true,
          },
        },
      },
      orderBy: (f, o) => o.desc(f.check_in),
      where: (f, o) => o.eq(f.id, id),
    });
  }
}
