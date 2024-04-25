import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateProvinceCommand } from "../impl/create-province.command";
import { ProvinceRepository } from "../../province.repository";


@CommandHandler(CreateProvinceCommand)
export class CreateProvinceHandler implements ICommandHandler<CreateProvinceCommand> {
    constructor(
        private readonly provinceRepository: ProvinceRepository
    ) { }
    async execute({ input }: CreateProvinceCommand): Promise<any> {
const res = await this.provinceRepository.findOne(1)
console.log(!res);

        const data = [
                     {
                    name: input.en.name,
                    description: input.en.description,
                    lang: 'en',
                    slug: ''
                },
                {
                    name: input.lo.name,
                    description: input.lo.description,
                    lang: 'lo',
                    slug: ''
                },
                {
                    name: input.zh_cn.name,
                    description: input.zh_cn.description,
                    lang: 'zh_cn',
                    slug: ''
                },
        ]
        console.log(data);
        
        // await this.provinceRepository.create({
        //     translates: [
        //         {
        //             name: input.en.name,
        //             description: input.en.description,
        //             lang: 'en',
        //             slug: ''
        //         },
        //         {
        //             name: input.lo.name,
        //             description: input.lo.description,
        //             lang: 'lo',
        //             slug: ''
        //         },
        //         {
        //             name: input.zh_cn.name,
        //             description: input.zh_cn.description,
        //             lang: 'zh_cn',
        //             slug: ''
        //         },
        //     ]
        // })
        return
    }
}