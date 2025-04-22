import { Output, minLength, object, optional, string, transform } from 'valibot';

const GetBySlugDto = object({
  slug: optional(transform(string('ບໍ່ຕ້ອງຫວ່າງເປົ່າ'), (input) => String(input))),
});

type GetBySlugDtoType = Output<typeof GetBySlugDto>;

export { GetBySlugDto, type GetBySlugDtoType };
