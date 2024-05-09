import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { DeleteCheckpointCommand } from "../impl/delete.command";
import { CheckpointRepository } from "../../checkpoint.repository";


@CommandHandler(DeleteCheckpointCommand)
export class DeleteCheckpointHandler implements ICommandHandler<DeleteCheckpointCommand> {
    constructor(
        private readonly checkPointRepository: CheckpointRepository
    ) { }
    async execute({ id }: DeleteCheckpointCommand): Promise<any> {
        const checkpoint = await this.checkPointRepository.findOne(id)
        if (!checkpoint) throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' })
        await this.checkPointRepository.remove(checkpoint.id)
        return { message: 'ລົບຂໍ້ມູນສຳເລັດ' }
    }
}