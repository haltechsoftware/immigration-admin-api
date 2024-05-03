import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveNewsCategoryCommand } from "../impl/remove-news-category.command";
import { NewsCategoryRepository } from "../../news-cateory.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(RemoveNewsCategoryCommand)
export class RemoveNewsCategoryHandler implements ICommandHandler<RemoveNewsCategoryCommand> {
    constructor(
        private readonly repository: NewsCategoryRepository
    ) { }
    async execute({ id }: RemoveNewsCategoryCommand): Promise<any> {
        const res = await this.repository.findOne(id)
        if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' })
        await this.repository.remove(id)
        return { message: 'ລົບຂໍ້ມູນສຳເລັດ' }
    }
}