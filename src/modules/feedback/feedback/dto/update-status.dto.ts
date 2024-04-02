import { Output, boolean, object } from 'valibot';

const UpdatePublishedDto = object({
  is_published: boolean('ຕ້ອງເປັນ boolean'),
});

type UpdatePublishedDtoType = Output<typeof UpdatePublishedDto>;

export { UpdatePublishedDto, type UpdatePublishedDtoType };
