import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveVisaCategoryCommand } from "../impl/remove-visa_category.command";
import { VisaCategoryRepository } from "../../visa_category.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(RemoveVisaCategoryCommand)
export class RemoveVisaCategoryHandler
  implements ICommandHandler<RemoveVisaCategoryCommand>
{
  constructor(
    private readonly _repository: VisaCategoryRepository,
  ) {}
  async execute({ id }: RemoveVisaCategoryCommand): Promise<any> {
    const visa_category = await this._repository.findOne(id);

    if (!visa_category)
      throw new NotFoundException({ message: 'ປະເພດວີຊານີ້ບໍ່ມີໃນລະບົບ' });
    
    await this._repository.remove(visa_category.id);

    return 'ລົບຂໍ້ມູນນີ້ສຳເລັດ';
  }
}