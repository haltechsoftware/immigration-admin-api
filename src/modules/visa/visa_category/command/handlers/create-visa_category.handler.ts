import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import CreateVisaCategoryCommand from "../impl/create-visa_category.command";
import { VisaCategoryRepository } from "../../visa_category.repository";

@CommandHandler(CreateVisaCategoryCommand)
export default class CreateVisaCategoryHandler
  implements ICommandHandler<CreateVisaCategoryCommand, string>
{
  constructor(
    private readonly _repository: VisaCategoryRepository,
  ) {}
    async execute({ dto }: CreateVisaCategoryCommand): Promise<string> {
        await this._repository.create({
            translates: [
                {
                    name: dto.lo_name,
                    lang: 'lo',
                    content: dto.lo_content
                },
                {
                    name: dto.en_name,
                    lang: 'en',
                    content: dto.en_content
                },
                {
                    name: dto.zh_name,
                    lang: 'zh_cn',
                    content: dto.zh_content
                },
            ],
          });
      
          return 'ບັນທຶກຂໍ້ມູນສຳເລັດ';
    }

}