import { CreateCountryDtoType } from "../../dtos/create-country.dto";

export class CreateCountryCommand {
    constructor(
        public readonly input: CreateCountryDtoType
    ){}
}