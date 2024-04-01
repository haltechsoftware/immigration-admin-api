import { MemoryStoredFile } from "nestjs-form-data";
import { Output, custom, enum_, maxLength, maxValue, minLength, minValue, number, object, optional, special, string } from "valibot";

enum Type {
    File = 'file',
    Dir = 'directory'
}

const CreateDirectoryDto = object({
    parent_id: string('ບໍ່ສາມາດຫວ່າງເປົ່າ'),
    file: optional(
        special((input) => input instanceof MemoryStoredFile, 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ', [
            custom(
                (input: MemoryStoredFile) =>
                    ['image/jpeg', 'image/png', 'image/webp'].includes(input.mimeType),
                'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
            ),
            custom(
                (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
                'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
            ),
        ]),
    ),
    name: string('ຕ້ອງເປັນ string'),
    type: enum_(Type, 'ຕ້ອງເປັນ file ຫຼື directory ເທົ່າ')
})

type CreateDirectoryDtoType = Output<typeof CreateDirectoryDto>;

export { CreateDirectoryDto, type CreateDirectoryDtoType };