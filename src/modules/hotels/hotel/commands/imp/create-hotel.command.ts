import { CreateHotelDtoType } from "../../dtos/create-hotel.dto";

export default class CreateHotelCommand {
    constructor(
        public readonly input: CreateHotelDtoType,
    ) {}
}