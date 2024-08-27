import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import IEnv from 'src/common/interface/env.interface';
import * as bannerSchema from 'src/modules/banners/entities';
import * as checkpointSchema from 'src/modules/checkpoints/entities';
import { contacts } from 'src/modules/contacts/entities/contacts';
import * as feedbackSchema from 'src/modules/feedback/entities';
import * as fileAndDirectorySchema from 'src/modules/files_and_directories/entities';
import * as hotelSchema from 'src/modules/hotels/entities';
import * as lawsSchema from 'src/modules/laws/entities';
import * as newsSchema from 'src/modules/news/entities';
import * as registrationSchema from 'src/modules/registrations/entities';
import * as serviceSchema from 'src/modules/services/entities';
import * as userSchema from 'src/modules/users/entities';
import * as visaCategorySchema from 'src/modules/visa/entities';

@Injectable()
export class DrizzleService {
  constructor(private readonly config?: ConfigService<IEnv>) {}

  private readonly client = mysql.createPool(this.config.get('DB_URL'));

  private readonly schema = {
    ...userSchema,
    ...bannerSchema,
    ...feedbackSchema,
    ...hotelSchema,
    ...newsSchema,
    ...visaCategorySchema,
    ...lawsSchema,
    ...checkpointSchema,
    ...fileAndDirectorySchema,
    ...registrationSchema,
    contacts,
    ...serviceSchema,
  };

  db() {
    return drizzle(this.client, {
      schema: this.schema,
      mode: 'default',
    });
  }
}
