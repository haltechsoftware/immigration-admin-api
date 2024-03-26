import { Output, boolean, object } from 'valibot';

const UpdatePrivatePopupDto = object({
  is_private: boolean('ຕ້ອງເປັນ boolean'),
});

type UpdatePrivatePopupDtoType = Output<typeof UpdatePrivatePopupDto>;

export { UpdatePrivatePopupDto, type UpdatePrivatePopupDtoType };
