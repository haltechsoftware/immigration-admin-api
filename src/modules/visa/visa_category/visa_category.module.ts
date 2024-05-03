import { Module } from '@nestjs/common';
import { VisaController } from './visa_category.controller';
import { VisaCategoryRepository } from './visa_category.repository';
import visaCategoryCommandHandlers from './command/handlers';
import visaCategoryQueryHandlers from './queries/handlers';

@Module({
    providers: [...visaCategoryCommandHandlers, ...visaCategoryQueryHandlers, VisaCategoryRepository],
    controllers: [VisaController],
})
export class VisaCategoryModule {}
