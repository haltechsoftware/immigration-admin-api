import { Module } from '@nestjs/common';
import { CheckpointCategoryController } from './checkpoint_category.controller';
import { CheckpointCategoryRepository } from './checkpoint_category.repository';
import { checkPointCategoryHandler } from './commands/handlers';
import { queryCheckpointCategoryHandler } from './queries/handlers';

@Module({
    controllers: [CheckpointCategoryController],
    providers: [
        ...checkPointCategoryHandler,
        ...queryCheckpointCategoryHandler,
        CheckpointCategoryRepository
    ]
})
export class CheckpointCategoryModule {}
