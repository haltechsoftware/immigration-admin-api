import { UpdateHotelDtoType } from "../../dtos/update-hotel.dto";


export default class UpdateHotelCommand {
    constructor(
        public readonly id: number,
        public readonly input: UpdateHotelDtoType,
    ) {}
}