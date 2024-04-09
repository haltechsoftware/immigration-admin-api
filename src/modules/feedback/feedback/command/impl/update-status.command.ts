import { UpdatePublishedDtoType } from "../../dto/update-status.dto";

export default class UpdateStatusCommand {
    constructor(
        public readonly id: number,
        public readonly dto: UpdatePublishedDtoType,
    ) {}
}