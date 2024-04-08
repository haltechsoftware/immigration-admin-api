import { object, Output, string, transform } from 'valibot';

export const QueryFileAndFolderByParentIdDto = object({
  parent_id: transform(string('ຕ້ອງເປັນ string'), (input) =>
    input === '' ? undefined : Number(input),
  ),
});

export type QueryFileAndFolderByParentIdDtoType = Output<
  typeof QueryFileAndFolderByParentIdDto
>;
