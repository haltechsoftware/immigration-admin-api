import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateNewsCommand } from "../impl/update-news.command";
import { NewsRepository } from "../../news.repository";
import { Inject, NotFoundException } from "@nestjs/common";
import { FILE_UPLOAD_SERVICE } from "src/infrastructure/file-upload/inject-key";
import { IFileUpload } from "src/infrastructure/file-upload/file-upload.interface";
import { NewsCategoryRepository } from "src/modules/news/category/news-cateory.repository";
import { generateSlugs } from "src/modules/news/helpers/news-category.slug";
import { format } from "date-fns";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";

@CommandHandler(UpdateNewsCommand)
export class UpdateNewsCategoryHandler implements ICommandHandler<UpdateNewsCommand> {
    constructor(
        @Inject(FILE_UPLOAD_SERVICE)
        private readonly fileUpload: IFileUpload,
        private readonly newsRepository: NewsRepository,
        private readonly newsCategoryRepository: NewsCategoryRepository,
    ) { }
    async execute({ id, input }: UpdateNewsCommand): Promise<any> {
        const news = await this.newsRepository.findOne(id)
        const newsCategory = await this.newsCategoryRepository.findOne(input.category_id);
        if (!newsCategory) throw new NotFoundException({ message: 'ປະເພດຂ່າວບໍ່ມີ' });
        if (!news) throw new NotFoundException({ message: 'ຂ່າວນີ້ບໍ່ມີ' });
        const slugName = generateSlugs(input);
        let imageUrl: string | undefined;
        if (input.thumbail) {
            await this.fileUpload.remove(news.thumbnail);

            imageUrl = await this.fileUpload.upload(
                'news/',
                input.thumbail.buffer,
                input.thumbail.originalName,
            );
        }
        await this.newsRepository.update({
            id: news.id,
            category_id: newsCategory.id,
            thumbnail: imageUrl,
            status: input.status,
            public_at: format(new Date(), DateTimeFormat.Timestamp),
            updated_at: format(new Date(), DateTimeFormat.Timestamp),
            translates: [
                {
                    id: input.lo_id,
                    title: input.lo_title,
                    slug: slugName.lo_title,
                    description: input.lo_description,
                    content: input.lo_content,
                    lang: 'lo'
                },
                {
                    id: input.en_id,
                    title: input.en_title,
                    slug: slugName.en_title,
                    description: input.en_description,
                    content: input.en_content,
                    lang: 'en'
                },
                {
                    id: input.zh_cn_id,
                    title: input.zh_cn_title,
                    slug: slugName.zh_cn_title,
                    description: input.zh_cn_description,
                    content: input.zh_cn_content,
                    lang: 'zh_cn'
                },
            ]
        })
        return { message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ' }
    }
}