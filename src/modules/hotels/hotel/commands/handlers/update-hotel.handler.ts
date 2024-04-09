import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IFileUpload } from "src/infrastructure/file-upload/file-upload.interface";
import { FILE_UPLOAD_SERVICE } from "src/infrastructure/file-upload/inject-key";
import { HotelRepository } from "../../hotel.repository";
import UpdateHotelCommand from "../imp/update-hotel.command";
import { format } from "date-fns";
import { DateTimeFormat } from '../../../../../common/enum/date-time-fomat.enum';

@CommandHandler(UpdateHotelCommand)
export class UpdateHotelHandler
  implements ICommandHandler<UpdateHotelCommand>
{
  constructor(
    private readonly repository: HotelRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}
    async execute({ id, input }: UpdateHotelCommand): Promise<any> {
        const hotel = await this.repository.findOne(id);

        if (!hotel)
        throw new NotFoundException({ message: 'ໂຮງແຮມນີ້ບໍ່ມີໃນລະບົບ' });

        let imageUrl: string | undefined;

        if (input.image) {
            await this.fileUpload.remove(hotel.image);

            imageUrl = await this.fileUpload.upload(
                'hotel/image/',
                input.image.buffer,
                input.image.originalName,
            );
        }

        await this.repository.update({
            id,
            image: imageUrl,
            link: input.link,
            latitude: input.latitude,
            longitude: input.longitude,
            phone_number: input.phone_number,
            updated_at: format(new Date(), DateTimeFormat.Timestamp),
            is_published: input.is_published,
            translates: [
                {
                    id: input.lo_id,
                    name: input.lo_name,
                    lang: 'lo',
                    address: input.lo_address,
                },
                {
                    id: input.en_id,
                    name: input.lo_name,
                    lang: 'lo',
                    address: input.lo_address,
                },
                {
                    id: input.zh_cn_id,
                    name: input.lo_name,
                    lang: 'lo',
                    address: input.lo_address,
                },
            ],
        });

        return 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ';
    }
}