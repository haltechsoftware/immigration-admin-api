import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PrivateTrueBannerCommand } from "../impl/private-true.banner.command";
import { BannerRepository } from "../../banner.repository";
@CommandHandler(PrivateTrueBannerCommand)
export class PrivateTrueBannerHandler implements ICommandHandler<PrivateTrueBannerCommand> {
    constructor(
        private readonly repository: BannerRepository
    ) {}

    async execute({ id }: PrivateTrueBannerCommand): Promise<any> {
        const banner = await this.repository.findOne(id);
        if (banner.is_private === true) {
            return { status: 400, message: 'ບໍ່ສາມາດປິດການມອງເຫັນຊໍ້າໄດ້' };
        }

        // Update the banner's is_private property to true
        banner.is_private = true;

        await this.repository.updatePrivate(banner);

        return { status: 201, message: 'ປິດການມອງເຫັນສຳເລັດ' };
    }
}
