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
    query: { limit, offset, room_no, check_in, check_out },
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
      where: (f, o) =>
        o.and(
          o.eq(f.hotel_id, hotelId),
          room_no ? o.eq(f.room_no, room_no) : undefined,
          check_in ? o.gte(f.check_in, check_in) : undefined,
          check_out ? o.lte(f.check_out, check_out) : undefined,
        ),
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
