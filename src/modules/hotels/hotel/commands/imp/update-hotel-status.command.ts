import { UpdatePopupStatusDtoType } from "../../dtos/update-hotel-status.dto";

export default class UpdateHotelStatusCommand {
    constructor(
        public readonly id: number,
        public readonly input: UpdatePopupStatusDtoType,
    ) {}
}