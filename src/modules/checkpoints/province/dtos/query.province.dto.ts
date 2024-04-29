import { LanguageDto } from "src/common/dtos/language.dto";
import { Output, merge, object, partial, string } from "valibot";

const QueryProvinceDto = merge([
    partial(LanguageDto),
    object({
        name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    })
])

type QueryProvinceDtoType = Output<typeof QueryProvinceDto>;

export { QueryProvinceDto, QueryProvinceDtoType };