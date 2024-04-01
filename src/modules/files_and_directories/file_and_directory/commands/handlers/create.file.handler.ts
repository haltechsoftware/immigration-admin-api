import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NodeFileUploadService } from "src/infrastructure/file-upload/node/node-file-upload.service";
import { FileAndDirectoryRepository } from "../../file_and_directory.repository";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { getFolderSize } from "../../size-folder/size-old";
import { CreateFilesCommand } from "../impl/create-file.command";
@CommandHandler(CreateFilesCommand)
export class CreateFileHander implements ICommandHandler<CreateFilesCommand> {
    constructor(
        private readonly nodeFileUpload: NodeFileUploadService,
        private readonly repository: FileAndDirectoryRepository,
    ) { }
    async execute({ input }: CreateFilesCommand): Promise<any> {
        if (input.file && input.type === 'directory') throw new BadRequestException({ message: 'ປະເພດຟາຍບໍ່ສະພອດທ' })
        const id = Number(input.parent_id)
        const fileAndDirectory = await this.repository.findOne(id)
        if(!fileAndDirectory) throw new NotFoundException({message: 'ບໍ່ມີໂຟເດີ້ ຢູ່ແລ້ວ'})
        if (fileAndDirectory.type === 'file') throw new BadRequestException({ message: 'ບໍ່ສາມາດຊ້ອນຟາຍ' })

        if (input.type === 'file') {
            const folderPathSize = `./client/${fileAndDirectory.name}`; // Replace with your folder path
            const { sizeInBytes } = getFolderSize(folderPathSize);

            const uploadFile = await this.nodeFileUpload.upload(
                `${fileAndDirectory.name}/`,
                input.file.buffer,
                input.file.originalName
            )
            await this.repository.create({
                name: uploadFile,
                type: input.type,
                size: input.file.size,
                parent_id: Number(input.parent_id)
            })
            await this.repository.updateSize({
                id,
                size: sizeInBytes
            })
            return { message: 'ອັບໂຫຼດຟາຍສຳເລັດ' };
        }


    }

}