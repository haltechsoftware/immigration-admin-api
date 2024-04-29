import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceRepository } from './province.repository';
import { provinceHandler } from './commands/handlers';
import { queryProvinceHandler } from './queries/handlers';

@Module({
    controllers: [ProvinceController],
    providers: [
        ...provinceHandler,
        ...queryProvinceHandler,
        ProvinceRepository
    ]
})
export class ProvinceModule {}
