
import { CreateHotelDto } from "./create-hotel.dto";
import { Output, custom, merge, object, omit, optional, special, string, transform } from 'valibot';
import { MemoryStoredFile } from "nestjs-form-data";


const UpdateHotelDto = merge([
    omit(CreateHotelDto, ['image']),
    object({
      image: optional(
        special(
          (input) => input instanceof MemoryStoredFile,
          'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
          [
            custom(
              (input: MemoryStoredFile) =>
                ['image/jpeg', 'image/png', 'image/webp'].includes(
                  input.mimeType,
                ),
              'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
            ),
            custom(
              (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
              'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
            ),
          ],
        ),
      ),
      lo_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
      en_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
      zh_cn_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
    }),
  ]);

type UpdateHotelDtoType = Output<typeof UpdateHotelDto>;
export { UpdateHotelDto, type UpdateHotelDtoType };