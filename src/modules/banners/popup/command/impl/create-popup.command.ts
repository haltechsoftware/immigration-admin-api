import { CreatePopupDtoType } from "../../dto/create-popup.dto";

export default class CreatePopupCommand {
    constructor(
        public readonly dto: CreatePopupDtoType,
    ) {}
}