import { Module } from '@nestjs/common';
import { countryHandler } from './commands/handlers';
import { CountryRepository } from './country.repository';
import { CountryController } from './country.controller';
import { queryCountryHandler } from './queries/handlers';

@Module({
    controllers: [CountryController],
    providers: [
        ...countryHandler,
        ...queryCountryHandler,
        CountryRepository,
    ]
})
export class CountryModule {}
