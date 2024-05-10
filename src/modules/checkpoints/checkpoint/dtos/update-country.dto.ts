import { Output, mergeAsync, objectAsync, string, transform} from "valibot";
import { CreateCheckpointDto } from "./create-checkpoint.dto";

const UpdateCheckpointDto = mergeAsync ([
    CreateCheckpointDto,
    objectAsync({
        lo_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
        en_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
        zh_cn_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
    })
])
   


type UpdateCheckpointDtoType = Output<typeof UpdateCheckpointDto>;

export { UpdateCheckpointDto, UpdateCheckpointDtoType };