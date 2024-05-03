import { Module } from '@nestjs/common';
import { NewsCategoryController } from './news-category.controller';
import { newCategoryQuery } from './queries/handlers';
import { newsCategoryHandler } from './commands/handlers';
import { NewsCategoryRepository } from './news-cateory.repository';

@Module({
    controllers: [NewsCategoryController],
    providers: [...newCategoryQuery, ...newsCategoryHandler, NewsCategoryRepository]
})
export class NewsCategoryModule { }
