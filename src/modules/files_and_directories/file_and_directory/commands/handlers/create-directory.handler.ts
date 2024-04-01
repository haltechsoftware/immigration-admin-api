import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateDirectoryCommand } from "../impl/create-directory.command";
import { FileAndDirectoryRepository } from "../../file_and_directory.repository";
import * as fs from 'fs';
import { BadRequestException } from "@nestjs/common";
import { getFolderSize } from "../../size-folder/size-old";
@CommandHandler(CreateDirectoryCommand)
export class CreateDirectoryHander implements ICommandHandler<CreateDirectoryCommand> {
    constructor(
        private readonly repository: FileAndDirectoryRepository,
    ) { }
    async execute({ input }: CreateDirectoryCommand): Promise<any> {
        if (input.name && input.type === 'file') throw new BadRequestException({ message: 'ປະເພດຂອງໂຟເດີ້ບໍ່ສະພອດທ' })
        const id = Number(input.parent_id)
        const fileAndDirectory = await this.repository.findOne(id)
        if (!fileAndDirectory && input.type === 'directory') {
            const folderPath = `./client/file-and-directory/` + input.name;
            const newPath = folderPath.replace('./client/', '');
            if (fs.existsSync(folderPath)) throw new BadRequestException({ message: `${input.name} ມີຢູ່ແລ້ວ` })
            fs.mkdirSync(folderPath)

            await this.repository.create({
                name: newPath,
                type: input.type,
                size: 0
            })

            return { message: 'ສ້າງໂຟເດີ້ສຳເລັດ' };

        } else if (fileAndDirectory && input.type === 'directory') {
            const folderPath = `./client/${fileAndDirectory.name}/` + input.name;
            const newPath = folderPath.replace('./client/', '');
            if (fs.existsSync(folderPath)) throw new BadRequestException({ message: `${input.name} ມີຢູ່ແລ້ວ` })
            fs.mkdirSync(folderPath)

            const folderPathSize = `./client/${fileAndDirectory.name}`; // Replace with your folder path
            const { sizeInBytes } = getFolderSize(folderPathSize);

            await this.repository.create({
                name: newPath,
                type: input.type,
                parent_id: Number(input.parent_id),
                size: 0
            })
            await this.repository.updateSize({
                id,
                size: sizeInBytes
            })
            return { message: 'ສ້າງໂຟເດີ້ສຳເລັດ' };
        }

    }

}