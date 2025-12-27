import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import contactQueryHandlers from './queries/handlers';
import { ContactRepository } from './contact.repository';
import contactCommandHandlers from './command/handlers';

@Module({
  providers: [
    ...contactCommandHandlers,
    ...contactQueryHandlers,
    ContactRepository,
  ],
  controllers: [ContactController],
})
export class ContactModule {}
