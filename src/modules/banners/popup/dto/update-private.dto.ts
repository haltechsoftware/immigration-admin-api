import { Output, mergeAsync, object, omitAsync, regex, string, transform } from "valibot";
import { CreatePopupDto } from "./create-popup.dto";


const UpdatePrivatePopupDto = mergeAsync([
    omitAsync(CreatePopupDto, ['image', 'link', 'start_time', 'end_time']),
    object({
        is_private: transform(string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ', [regex(/^[0-9]+$/, "ຄວນເປັນໂຕເລກ: 0-9.")]), (input) => Boolean(Number(input))),
    }),
  ]);
  
  type UpdatePrivatePopupDtoType = Output<typeof UpdatePrivatePopupDto>;
  
  export { UpdatePrivatePopupDto, type UpdatePrivatePopupDtoType };