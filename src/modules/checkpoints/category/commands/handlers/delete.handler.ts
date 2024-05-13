import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckpointCategoryRepository } from '../../checkpoint_category.repository';
import { DeleteCheckpointCategoryCommand } from '../impl/delete.command';

@CommandHandler(DeleteCheckpointCategoryCommand)
export class DeleteCheckpointCategoryHandler
  implements ICommandHandler<DeleteCheckpointCategoryCommand>
{
  constructor(
    private readonly checkPointCategoryRepository: CheckpointCategoryRepository,
  ) {}
  async execute({ id }: DeleteCheckpointCategoryCommand): Promise<any> {
    const checkpointCategory = await this.checkPointCategoryRepository.findOne(
      id,
    );
    if (!checkpointCategory)
      throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });

    await this.checkPointCategoryRepository.remove(checkpointCategory.id);

    return 'ລົບຂໍ້ມູນສຳເລັດ';
  }
}
