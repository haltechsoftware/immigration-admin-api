import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { contacts } from '../entities/contacts';

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

  async remove(id: number): Promise<void> {
    await this._drizzle.db().delete(contacts).where(eq(contacts.id, id));
  }
}
