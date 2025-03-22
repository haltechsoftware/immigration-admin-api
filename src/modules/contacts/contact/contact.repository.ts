import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { Contact, contacts, InsertContact } from '../entities/contacts';
import SendContactCommand from './command/impl/send-contact.command';

export type InsertContactType = InsertContact;
@Injectable()
export class ContactRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  private _getByIdPrepared = this._drizzle
    .db()
    .query.contacts.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare();
  async getById(id: number) {
    return await this._getByIdPrepared.execute({ id });
  }

  async create({ input }: SendContactCommand): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
        await tx.insert(contacts).values({
        name: input.fullName,
        email: input.email,
        message: input.message,
      });
    });
  }

  async remove(id: number): Promise<void> {
    await this._drizzle.db().delete(contacts).where(eq(contacts.id, id));
  }
}
