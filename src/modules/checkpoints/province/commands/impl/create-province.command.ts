import { CreateProvinceDtoType } from "../../dtos/create-province.dto";

export class CreateProvinceCommand {
    constructor(
        public readonly input: CreateProvinceDtoType
    ){}
}