import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { intendedAddress } from 'src/modules/registrations/entities';
import { GuestCheckInCommand } from '../impl/guests-check-in.command';

@CommandHandler(GuestCheckInCommand)
export class GuestCheckInHandler
  implements ICommandHandler<GuestCheckInCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ data, hotelId }: GuestCheckInCommand): Promise<any> {
    const arrival = await this.drizzle
      .db()
      .query.arrivalRegistration.findFirst({
        where: (f, o) => o.eq(f.verification_code, data.verify_code),
      });

    if (!arrival)
      throw new NotFoundException({
        message: 'ກວດສອບລະຫັດລົ້ມເຫຼວ ລະຫັດບໍ່ຖືກຕ້ອງ!',
      });

    const hotel = await this.drizzle.db().query.hotels.findFirst({
      with: {
        translates: {
          where: (f, o) => o.eq(f.lang, 'en'),
        },
      },
      where: (f, o) => o.eq(f.id, hotelId),
    });

    await this.drizzle.db().insert(intendedAddress).values({
      arrival_registration_id: arrival.id,
      hotel_id: hotelId,
      name: hotel.translates[0].name,
      province: hotel.translates[0].province,
      district: hotel.translates[0].district,
      village: hotel.translates[0].village,
      room_no: data.room_no,
      check_in: data.check_in,
      check_out: data.check_out,
    });

    return 'ເພີ່ມແຂກເຂົ້າພັກສຳເລັດ!';
  }
}
