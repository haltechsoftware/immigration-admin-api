import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { intendedAddress } from 'src/modules/registrations/entities';
import { GuestListQuery } from '../impl/guest-list.query';

@QueryHandler(GuestListQuery)
export class GuestListHandler implements IQueryHandler<GuestListQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    hotelId,
    query: { limit, offset },
  }: GuestListQuery): Promise<any> {
    const res = await this.drizzle.db().query.intendedAddress.findMany({
      columns: {
        id: true,
        check_in: true,
        check_out: true,
        room_no: true,
      },
      with: {
        arrival_registration: {
          with: {
            personal_information: {
              columns: {
                id: true,
                family_name: true,
                name: true,
                gender: true,
              },
            },
          },
        },
      },
      orderBy: (f, o) => o.desc(f.check_in),
      where: (f, o) => o.eq(f.hotel_id, hotelId),
      limit,
      offset,
    });

    const total = await this.drizzle
      .db()
      .select({ value: count() })
      .from(intendedAddress)
      .where(eq(intendedAddress.hotel_id, hotelId));

    return {
      data: res.map((val) => ({
        ...val,
        personal_information: val.arrival_registration.personal_information,
        arrival_registration: undefined,
      })),
      total: total[0].value,
    };
  }
}
