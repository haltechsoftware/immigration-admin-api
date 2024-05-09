import { Output, mergeAsync, minLength, objectAsync, string, transform } from "valibot";
import { CreateCountryDto } from "./create-country.dto";

const UpdateCountryDto = mergeAsync([
    CreateCountryDto,
    objectAsync({
        lo_id: transform(string([minLength(1, 'ບໍ່ຄວນວ່າງເປົ່າ')]), (input) => Number(input)),
        en_id: transform(string([minLength(1, 'ບໍ່ຄວນວ່າງເປົ່າ')]), (input) => Number(input)),
        zh_cn_id: transform(string([minLength(1, 'ບໍ່ຄວນວ່າງເປົ່າ')]), (input) => Number(input)),
    })
])


type UpdateCountryDtoType = Output<typeof UpdateCountryDto>;

export { UpdateCountryDto, UpdateCountryDtoType };