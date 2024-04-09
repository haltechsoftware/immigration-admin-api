import { Output, boolean, object } from 'valibot';

const UpdateHotelStatusDto = object({
  is_published: boolean('ຕ້ອງເປັນ boolean'),
});

type UpdatePopupStatusDtoType = Output<typeof UpdateHotelStatusDto>;

export { UpdateHotelStatusDto, type UpdatePopupStatusDtoType };
