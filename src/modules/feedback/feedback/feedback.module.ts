import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import feedbackCommandHandlers from './command/handlers';
import { FeedbackRepository } from './feedback.repository';
import feedbackQueryHandlers from './queries/handlers';

@Module({
    providers: [...feedbackCommandHandlers, ...feedbackQueryHandlers, FeedbackRepository],
    controllers: [FeedbackController],
})
export class FeedbackModule {}
