import { UpdatePopupDtoType } from "../../dto/update-popup.dto";


export default class UpdatePopupCommand {
    constructor(
        public readonly id: number,
        public readonly dto: UpdatePopupDtoType,
    ) {}
}