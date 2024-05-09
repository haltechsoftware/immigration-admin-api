import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { newsHandler } from './commands/handlers';
import { NewsRepository } from './news.repository';
import { NewsCategoryRepository } from '../category/news-cateory.repository';
import { newsQueryHandlers } from './queries/handlers';

@Module({
    controllers: [NewsController],
    providers: [
        NewsRepository,
        NewsCategoryRepository,
        ...newsHandler,
        ...newsQueryHandlers
    ]
})
export class NewsModule {}
