import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveBannerCommand } from "../impl/remove-banner";
import { BannerRepository } from "../../banner.repository";
import { NodeFileUploadService } from "src/infrastructure/file-upload/node/node-file-upload.service";

@CommandHandler(RemoveBannerCommand)
export class RemoveBannerHandler implements ICommandHandler<RemoveBannerCommand>{
    constructor(
        private readonly repository: BannerRepository,
        private readonly fileUpload: NodeFileUploadService,
    ) { }
    async execute({ id }: RemoveBannerCommand): Promise<any> {
        const banner = await this.repository.findOne(id)

        await this.fileUpload.remove(banner.image)
        await this.repository.remove(banner.id)
        return { status: 201, message: 'ລົບຂໍ້ມູນແບນເນີ້ ສຳເລັດ' }
    }

}