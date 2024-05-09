import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCheckpointCategoryCommand } from "../impl/delete.command";
import { NotFoundException } from "@nestjs/common";
import { CheckpointCategoryRepository } from "../../checkpoint_category.repository";


@CommandHandler(DeleteCheckpointCategoryCommand)
export class DeleteCheckpointCategoryHandler implements ICommandHandler<DeleteCheckpointCategoryCommand> {
    constructor(
        private readonly checkPointCategoryRepository: CheckpointCategoryRepository
    ) { }
    async execute({ id }: DeleteCheckpointCategoryCommand): Promise<any> {
        const checkpointCategory = await this.checkPointCategoryRepository.findOne(id)
        if (!checkpointCategory) throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' })
        await this.checkPointCategoryRepository.remove(checkpointCategory.id)
        return { message: 'ລົບຂໍ້ມູນສຳເລັດ' }
    }
}