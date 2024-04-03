import { object, optional, Output, string, transform } from 'valibot';

export const QueryFileAndDirectoryDto = object({
  parent_id: optional(
    transform(string(), (input) => (input === '' ? undefined : Number(input))),
  ),
});

export type QueryFileAndDirectoryDtoType = Output<
  typeof QueryFileAndDirectoryDto
>;
