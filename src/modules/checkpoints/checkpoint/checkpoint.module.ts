import { Module } from '@nestjs/common';
import { CheckpointController } from './checkpoint.controller';
import { CheckpointRepository } from './checkpoint.repository';
import { checkPointHandler } from './commands/handlers';
import { queryCheckpointHandler } from './queries/handlers';

@Module({
    controllers: [CheckpointController],
    providers: [
        ...checkPointHandler,
        ...queryCheckpointHandler,
        CheckpointRepository
    ]
})
export class CheckpointModule { }
