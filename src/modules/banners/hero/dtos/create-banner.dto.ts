import { MemoryStoredFile } from "nestjs-form-data";
import { Output, maxLength, minLength, string, objectAsync, stringAsync, customAsync, optionalAsync, special, custom, transform, regex } from "valibot";

// Define the schema for the language object
const isValidDateFormat = (input: string, format: string): boolean => {
    return !!input.match(new RegExp(format));
};

const CreateBannerHeroDto = objectAsync({
    image: optionalAsync(
        special((input) => input instanceof MemoryStoredFile, 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ', [
            custom(
                (input: MemoryStoredFile) =>
                    ['image/jpeg', 'image/png', 'image/webp'].includes(input.mimeType),
                'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
            ),
            custom(
                (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
                'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
            ),
        ]),
    ),
    link: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
    ]),
    start_time: stringAsync('Event date is required.', [
        customAsync(async (input: string) => {
            // Example validation for date format (YYYY-MM-DD)
            return isValidDateFormat(input, '^\\d{4}-\\d{2}-\\d{2}$');
        }, 'Invalid date format. Please provide a date in YYYY-MM-DD format.'),
    ]),

    end_time: stringAsync('Event date is required.', [
        customAsync(async (input: string) => {
            // Example validation for date format (YYYY-MM-DD)
            return isValidDateFormat(input, '^\\d{4}-\\d{2}-\\d{2}$');
        }, 'Invalid date format. Please provide a date in YYYY-MM-DD format.'),
    ]),
    // translate_lo: transform(string(), (input) => {
    // console.log(input);

    is_private: transform(string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ', [regex(/^[0-9]+$/, "ຄວນເປັນໂຕເລກ: 0-9.")]), (input) => Boolean(Number(input))),

    lo_title: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ', [
        minLength(2, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 2 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.')
    ]),
    lo_description: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
    lo_lng: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(2, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
    en_title: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
    en_description:string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
    en_lng: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(2, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
    zh_cn_title: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
    zh_cn_description: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
    zh_cn_lng: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
});

// Define the type for the DTO
type CreateBannerHeroType = Output<typeof CreateBannerHeroDto>;

export { CreateBannerHeroDto, CreateBannerHeroType };
