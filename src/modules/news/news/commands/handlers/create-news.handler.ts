import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateNewsCommand } from "../impl/create-news.command";
import { NewsRepository } from "../../news.repository";
import { NewsCategoryRepository } from "src/modules/news/category/news-cateory.repository";
import { Inject, NotFoundException } from "@nestjs/common";
import { generateSlugs } from "src/modules/news/helpers/news-category.slug";
import { format } from "date-fns";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";
import { FILE_UPLOAD_SERVICE } from "src/infrastructure/file-upload/inject-key";
import { IFileUpload } from "src/infrastructure/file-upload/file-upload.interface";

@CommandHandler(CreateNewsCommand)
export class CreateNewsHandler implements ICommandHandler<CreateNewsCommand> {
    constructor(
        @Inject(FILE_UPLOAD_SERVICE)
        private readonly fileUpload: IFileUpload,
        private readonly newsRepository: NewsRepository,
        private readonly newsCategoryRepository: NewsCategoryRepository,
    ) { }
    async execute({ input }: CreateNewsCommand): Promise<any> {
        const newsCategory = await this.newsCategoryRepository.findOne(input.category_id);
        if (!newsCategory) throw new NotFoundException({ message: 'ປະເພດຂ່າວບໍ່ມີ' });
        const slugName = generateSlugs(input);
        const image = await this.fileUpload.upload(
            'news/',
            input.thumbail.buffer,
            input.thumbail.originalName,
        );
        await this.newsRepository.create({
            category_id: newsCategory.id,
            thumbnail: image,
            status: input.status,
            public_at: format(new Date(), DateTimeFormat.Timestamp),
            translates: [
                {
                    title: input.lo_title,
                    slug: slugName.lo_title,
                    description: input.lo_description,
                    content: input.lo_content,
                    lang: 'lo'
                },
                {
                    title: input.en_title,
                    slug: slugName.en_title,
                    description: input.en_description,
                    content: input.en_content,
                    lang: 'en'
                },
                {
                    title: input.zh_cn_title,
                    slug: slugName.zh_cn_title,
                    description: input.zh_cn_description,
                    content: input.zh_cn_content,
                    lang: 'zh_cn'
                },
            ]
        })
        return {message: 'ບັນທຶກຂໍ້ມູນສຳເລັດ'}
    }
}