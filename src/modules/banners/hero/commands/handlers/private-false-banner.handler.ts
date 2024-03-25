import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BannerRepository } from "../../banner.repository";
import { PrivateFalseBannerCommand } from "../impl/private-false.banner.command";

@CommandHandler(PrivateFalseBannerCommand)
export class PrivateFalseBannerHandler implements ICommandHandler<PrivateFalseBannerCommand> {
    constructor(
        private readonly repository : BannerRepository
    ){}
    async execute({id}: PrivateFalseBannerCommand): Promise<any> {
        const banner = await this.repository.findOne(id)
        
        if(banner.is_private === false){
            return {status: 400, message: 'ບໍ່ສາມາດເປິດການມອງເຫັນຊໍ້າໄດ້'}
        }
        if(banner.end_time < new Date()){
            return {status: 400, message: 'ບໍ່ສາມາດເປິດການມອງເຫັນ ແບຣນເນີ້ ໝົດອາຍຸເປີດການມອງເຫັນແລ້ວ'}
        }
         banner.is_private = false 
        await this.repository.updatePrivate(banner)
        return {status: 201, message: 'ເປິດການມອງເຫັນສຳເລັດ'}
    }

}