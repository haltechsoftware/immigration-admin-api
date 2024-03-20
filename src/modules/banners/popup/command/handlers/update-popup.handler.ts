import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NodeFileUploadService } from "src/infrastructure/file-upload/node/node-file-upload.service";
import UpdatePopupCommand from "../impl/update-popup.command";
import { PopupRepository } from "../../popup.repository";
import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { existsSync, unlinkSync } from "fs";

@CommandHandler(UpdatePopupCommand)
export default class UpdatePopupHandler
  implements ICommandHandler<UpdatePopupCommand, string>
{
  constructor(
    private readonly repository: PopupRepository,
    private readonly fileUpload: NodeFileUploadService,
  ) {}

  async execute({ dto,id }: UpdatePopupCommand): Promise<string> {
    const popup = await this.repository.getById(id);

    if (!popup)
      throw new NotFoundException({ message: 'ບໍ່ມີໃນລະບົບ' });
    
    let image: string | undefined;

    if (dto.image) {
      image = await this.fileUpload.upload(
        'image/',
        dto.image.buffer,
        dto.image.originalName,
      );
    }

    if (dto.end_time >= dto.start_time) {
        await this.repository.update({
            id,
            image: image,
            link: dto.link,
            is_private: dto.is_private,
            start_time: new Date(dto.start_time),
            end_time: new Date(dto.end_time),
        });

        return 'ອັດເດດສຳເລັດ';
    } else {
    
    if (image) {
        const profilePath = `./client/${image}`;
        if (existsSync(profilePath)) {
            unlinkSync(profilePath);
        }
    }

    throw new HttpException('ວັນທີສິ້ນສຸດຕ້ອງໃຫ່ຍກວ່າ ຫຼື ເທົ່າກັບວັນທີເລີ່ມ', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}