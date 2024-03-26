import { UpdatePrivatePopupDtoType } from "../../dto/update-private.dto";

export default class UpdatePrivatePopupCommand {
    constructor(
        public readonly id: number,
        public readonly dto: UpdatePrivatePopupDtoType,
    ) {}
}