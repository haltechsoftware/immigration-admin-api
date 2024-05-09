import { UpdateCountryDtoType } from "../../dtos/update-country.dto";

export class UpdateCountryCommand {
    constructor(
        public readonly id: number,
        public readonly input: UpdateCountryDtoType,
    ){}
}