import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IFileUpload } from "src/infrastructure/file-upload/file-upload.interface";
import CreateHotelCommand from "../imp/create-hotel.command";
import { HotelRepository } from "../../hotel.repository";
import { FILE_UPLOAD_SERVICE } from '../../../../../infrastructure/file-upload/inject-key';

@CommandHandler(CreateHotelCommand)
export default class CreateHotelHandler
  implements ICommandHandler<CreateHotelCommand, string>
{
  constructor(
    private readonly repository: HotelRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}
    async execute({ input }: CreateHotelCommand): Promise<any> {
        const image = await this.fileUpload.upload(
            'hotel/image/',
            input.image.buffer,
            input.image.originalName,
          );
      
          await this.repository.create({
            image,
            link: input.link,
            latitude: input.latitude,
            longitude: input.longitude,
            phone_number: input.phone_number,
            is_published: input.is_published,
            translates: [
              {
                name: input.lo_name,
                lang: 'lo',
                address: input.lo_address,
              },
              {
                name: input.en_name,
                lang: 'en',
                address: input.en_address,
              },
              {
                name: input.zh_name,
                lang: 'zh_cn',
                address: input.zh_address,
              },
            ],
          });
      
        return 'ບັນທຶກຂໍ້ມູນສຳເລັດ';
    }

}