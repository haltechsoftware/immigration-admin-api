import { Output, object, special, transform } from 'valibot';

const GetByIdDto = object({
  id: transform(
    special<number>((input) => !isNaN(Number(input)), 'Invalid type'),
    (input) => Number(input),
  ),
});

type GetByIdDtoType = Output<typeof GetByIdDto>;

export { GetByIdDto, type GetByIdDtoType };
