import { BadRequestException } from "@nestjs/common";

export const validateDate = (date: string, fieldName: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new BadRequestException({ message: `${fieldName} ຕ້ອງເປັນ YYYY-MM-DD` });
    }
    // const nowYear = new Date().getFullYear();
    // const [year, month, day] = date.split('-').map(Number);
    // const isValid = year <=  nowYear && month >= 1 && month <= 12 && day >= 1 && day <= 31 && !isNaN(new Date(date).getTime());
    // if (!isValid) {
    //     throw new BadRequestException({ message: `${fieldName} ບໍ່ຖືກຕ້ອງ` });
    // }
};