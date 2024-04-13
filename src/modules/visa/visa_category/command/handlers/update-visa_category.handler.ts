import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateVisaCategoryCommand } from "../impl/update-visa_category.command";
import { VisaCategoryRepository } from "../../visa_category.repository";
import { NotFoundException } from "@nestjs/common";
import { format } from "date-fns";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";


@CommandHandler(UpdateVisaCategoryCommand)
export class UpdateVisaCategoryHandler
  implements ICommandHandler<UpdateVisaCategoryCommand>
{
  constructor(
    private readonly _repository: VisaCategoryRepository,
  ) {}

  async execute({ id, input }: UpdateVisaCategoryCommand): Promise<any> {
    const visa_category = await this._repository.findOne(id);

    if (!visa_category)
    throw new NotFoundException({ message: 'ປະເພດວີຊານີ້ບໍ່ມີໃນລະບົບ' });
    await this._repository.update({
        id: visa_category.id,
        updated_at: format(new Date(), DateTimeFormat.Timestamp),
        translates: [
            {
                id: input.lo_id,
                name: input.lo_name,
                lang: 'lo',
                content: input.lo_content
            },
            {
                id: input.en_id,
                name: input.en_name,
                lang: 'en',
                content: input.en_content
            },
            {
                id: input.zh_cn_id,
                name: input.zh_name,
                lang: 'zh_cn',
                content: input.zh_content
            },
        ],
      });
  
      return 'ອັດເດດຂໍ້ມູນສຳເລັດ';
  }
}