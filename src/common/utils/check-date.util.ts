import { BadRequestException } from '@nestjs/common';
import { TypeCheckDate } from '../enum/date-time-fomat.enum';

export function validateCheckInDate(
  check_in_date: string | Date,
  type: TypeCheckDate,
) {
  const checkInDate = new Date(check_in_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (type === TypeCheckDate.ARRIVAL) {
    if (checkInDate < today) {
      throw new BadRequestException('Check-in date must be in the future.');
    }
  } else if (type === TypeCheckDate.DEPARTURE) {
    if (checkInDate < today) {
      throw new BadRequestException('Check-in date must be in the future.');
    }
  } else if (type === TypeCheckDate.SCAN) {
    if (checkInDate < today) {
      throw new BadRequestException(
        'ບໍ່ສາມາດສະແກນໄດ້ ເພາະວ່າໄກວັນທີແລ້ວ, ກະລຸນາລົງທະບຽນໃໝ່.',
      );
    }
  }
}
