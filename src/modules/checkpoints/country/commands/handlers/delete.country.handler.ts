import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCountryCommand } from "../impl/delete-country.command";
import { CountryRepository } from "../../country.repository";
import { NotFoundException } from "@nestjs/common";


@CommandHandler(DeleteCountryCommand)
export class DeleteCountryHandler implements ICommandHandler<DeleteCountryCommand> {
    constructor(
        private readonly countryRepository: CountryRepository
    ) { }
    async execute({ id }: DeleteCountryCommand): Promise<any> {
        const country = await this.countryRepository.findOne(id)
        if (!country) throw new NotFoundException({ message: 'ປະເທດນີ້ບໍ່ມີໃນລະບົບ' })
        await this.countryRepository.remove(country.id)
        return { message: 'ລົບຂໍ້ມູນສຳເລັດ' }
    }
}