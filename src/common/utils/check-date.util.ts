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
    // สร้างวัน check-in โดยตัดเวลาให้เป็น 00:00:00 (เริ่มต้นของวัน)
    const checkInDay = new Date(checkInDate);
    checkInDay.setHours(0, 0, 0, 0);

    // คำนวณเวลา cutoff = วันถัดไปของ check-in ตอน 06:00 น.
    // (อนุญาตให้สแกนได้ถึง 6 โมงเช้าของวันถัดไป)
    const cutoff = new Date(checkInDay);
    cutoff.setDate(cutoff.getDate() + 1);
    cutoff.setHours(6, 0, 0, 0);

    // ถ้าเวลาปัจจุบันเลย cutoff แล้ว แปลว่าเกิน 6 ชั่วโมงของวันถัดไป → throw error
    if (new Date() > cutoff) {
      throw new BadRequestException(
        'ບໍ່ສາມາດສະແກນໄດ້ ເພາະວ່າໄກວັນທີແລ້ວ, ກະລຸນາລົງທະບຽນໃໝ່.',
      );
    }
  }
}
