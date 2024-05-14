import getJsonStringSize from 'src/common/utils/get-json-string-size';
import isValidJson from 'src/common/utils/is-valid-json';
import {
  any,
  custom,
  maxLength,
  minLength,
  number,
  object,
  Output,
  string,
  transform,
} from 'valibot';

export const NewsTranslateDto = object({
  id: number('ຈະຕ້ອງເປັນ string'),
  title: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  description: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
  content: transform(
    any([
      custom(
        (input) => (typeof input === 'string' ? isValidJson(input) : true),
        'ຕ້ອງເປັນ string json',
      ),
      custom(
        (input) =>
          typeof input === 'string'
            ? getJsonStringSize(input) < 5 * 1024 * 1024
            : true,
        'ຂະໜາດຂອງຂໍ້ມູນຕ້ອງບໍ່ເກີນ 5MB',
      ),
    ]),
    (input) => (typeof input === 'string' ? JSON.parse(input) : input),
  ),
});

export type NewsTranslateDtoType = Output<typeof NewsTranslateDto>;
