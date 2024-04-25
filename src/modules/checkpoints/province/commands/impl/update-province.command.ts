import { UpdateProvinceDtoType } from "../../dtos/update-province.dto";

export class UpdateProvinceCommand {
    constructor(
        public readonly id: number,
        public readonly input: UpdateProvinceDtoType,
    ){}
}