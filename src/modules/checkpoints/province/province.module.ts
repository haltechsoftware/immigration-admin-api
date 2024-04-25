import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceRepository } from './province.repository';
import { provinceHandler } from './commands/handlers';

@Module({
    controllers: [ProvinceController],
    providers: [
        ...provinceHandler,
        ProvinceRepository
    ]
})
export class ProvinceModule {}
