import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDirectoryCommand } from '../impl/delete-directory.command';
import { FileAndDirectoryRepository } from '../../file_and_directory.repository';
import fs from 'fs';

@CommandHandler(DeleteDirectoryCommand)
export class DeleteDirectoryHandler
    implements ICommandHandler<DeleteDirectoryCommand>
{
    constructor(
        private readonly repository: FileAndDirectoryRepository,
    ) { }
    async execute({ id }: DeleteDirectoryCommand): Promise<any> {
        const folder = await this.repository.findOne(id);

        if (!folder) throw new NotFoundException({ message: 'ໂຟເດີ້ນີ້ບໍ່ມີໃນລະບົບ' });
        if(folder.type === 'file') throw new BadRequestException({message: 'ບໍ່ພົບ ໂຟເດີ້ນີ້'})
        try {
            fs.rmdirSync('./client/' + folder.name);
            await this.repository.remove(folder.id);
            return 'ໂຟເດີ້ຖືກລົບ ສຳເລັດ';
        } catch (error) {
            if (error.code === 'ENOTEMPTY') {
                throw new ConflictException(`ບໍ່ສາມາດລົບໂຟເດີ້: ${folder.name}`);
            }
        }
    }
}
