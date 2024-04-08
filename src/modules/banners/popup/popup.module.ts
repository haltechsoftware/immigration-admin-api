import { Module } from '@nestjs/common';
import { PopupController } from './popup.controller';
import popupCommandHandlers from './command/handlers';
import popupQueryHandlers from './queries/handlers';
import { PopupRepository } from './popup.repository';

@Module({
  providers: [...popupCommandHandlers, ...popupQueryHandlers, PopupRepository],
  controllers: [PopupController],
})
export class PopupModule {}
