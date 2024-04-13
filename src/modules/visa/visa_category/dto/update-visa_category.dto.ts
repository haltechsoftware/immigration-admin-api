import { Output, merge, number, object, omit, optional, string, transform } from "valibot";
import { CreateVisaCategoryDto } from "./create.visa_category.dto";

const UpdateVisaCategoryDto = merge([
    CreateVisaCategoryDto,
    object({
      lo_id: transform(number('ຈະຕ້ອງເປັນ number'), (input) => Number(input)),
      en_id: transform(number('ຈະຕ້ອງເປັນ number'), (input) => Number(input)),
      zh_cn_id: transform(number('ຈະຕ້ອງເປັນ number'), (input) => Number(input)),
    }),
  ]);
  
  type UpdateVisaCategoryType = Output<typeof UpdateVisaCategoryDto>;
  export { UpdateVisaCategoryDto, type UpdateVisaCategoryType };
  