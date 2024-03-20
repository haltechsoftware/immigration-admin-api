import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import CreatePopupCommand from "../impl/create-popup.command";
import { PopupRepository } from "../../popup.repository";
import { NodeFileUploadService } from "src/infrastructure/file-upload/node/node-file-upload.service";
import { existsSync, unlinkSync } from "fs";
import { HttpException, HttpStatus } from "@nestjs/common";


@CommandHandler(CreatePopupCommand)
export default class CreateUserHandler
  implements ICommandHandler<CreatePopupCommand, string>
{
  constructor(
    private readonly repository: PopupRepository,
    private readonly fileUpload: NodeFileUploadService,
  ) {}

  async execute({ dto }: CreatePopupCommand): Promise<string> {
    let image: string | undefined;

    if (dto.image) {
      image = await this.fileUpload.upload(
        'image/',
        dto.image.buffer,
        dto.image.originalName,
      );
    }

    try {
      if (dto.end_time >= dto.start_time) {
          await this.repository.create({
              image: image,
              link: dto.link,
              is_private: dto.is_private,
              start_time: new Date(dto.start_time),
              end_time: new Date(dto.end_time),
          });

          return 'ເພີ່ມສຳເລັດ';
      } else {
        throw new HttpException({message: 'ວັນທີສິ້ນສຸດຕ້ອງໃຫ່ຍກວ່າ ຫຼື ເທົ່າກັບວັນທີເລີ່ມ.' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {

      if (image) {
        const profilePath = `./client/${image}`;
        if (existsSync(profilePath)) {
          unlinkSync(profilePath);
        }
      }
        // Handle the error here
      console.error('Error:', error);
      throw new HttpException({message: 'ເພີ່ມ popup ມີບັນຫາ.'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}