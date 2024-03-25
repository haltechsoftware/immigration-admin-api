import { UpdateBannerDtoType } from "../../dtos/update-banner.dto";

export class UpdateBannerCommand {
    constructor(
        public readonly id: number,
        public readonly input: UpdateBannerDtoType,
    ){}
}