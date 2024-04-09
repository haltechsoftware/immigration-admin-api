import { Output, minLength, object, string, transform } from 'valibot';

const GetByIdDto = object({
  id: transform(
    string('ຈະຕ້ອງເປັນ string', [minLength(1, 'ຈະຕ້ອງບໍ່ວ່າງເປົ່າ')]),
    (input) => Number(input),
  ),
});

type GetByIdDtoType = Output<typeof GetByIdDto>;

export { GetByIdDto, type GetByIdDtoType };
