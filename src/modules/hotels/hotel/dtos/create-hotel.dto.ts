import { MemoryStoredFile } from "nestjs-form-data";
import { Output, custom, maxLength, minLength, object, regex, special, string, transform } from "valibot";


const CreateHotelDto = object({
    image: special(
        (input) => input instanceof MemoryStoredFile,
        'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
        [
          custom(
            (input: MemoryStoredFile) =>
              ['image/jpeg', 'image/png', 'image/webp'].includes(input.mimeType),
            'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
          ),
          custom(
            (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
            'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
          ),
        ],
    ),

    // latitude: transform(string('ຈະຕ້ອງເປັນ number.'), (input) => Number(input)),
    latitude: string('ຈະຕ້ອງເປັນ string.'),
    longitude: string('ຈະຕ້ອງເປັນ string.'),

    phone_number: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(6, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 6 ຕົວເລກ.'),
        maxLength(12, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 12 ຕົວເລກ.'),
    ]),

    link: string('ຈະຕ້ອງເປັນ string.'),

    is_published: transform(
        string('ຈະຕ້ອງເປັນ string', [regex(/^[0-9]+$/, 'ຄວນເປັນໂຕເລກ: 0-9.')]),
        (input) => Boolean(Number(input)),
    ),

    lo_name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
    ]),

    en_name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
    ]),

    zh_name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
    ]),

    lo_address: string('ຈະຕ້ອງເປັນ string.'),

    en_address: string('ຈະຕ້ອງເປັນ string.'),

    zh_address: string('ຈະຕ້ອງເປັນ string.'),
});

type CreateHotelDtoType = Output<typeof CreateHotelDto>;

export { CreateHotelDto, type CreateHotelDtoType };