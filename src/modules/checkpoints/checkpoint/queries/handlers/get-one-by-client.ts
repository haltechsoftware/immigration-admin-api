import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetOneClientCheckpointCommand } from '../impl/get-one-client';

@QueryHandler(GetOneClientCheckpointCommand)
export class QueryGetOneClientCheckpointHandler
  implements IQueryHandler<GetOneClientCheckpointCommand>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    params: slug,
    query: { lang },
  }: GetOneClientCheckpointCommand): Promise<any> {

    const translate = await this._drizzle.db().query.checkpointTranslate.findFirst({
      where: (f, o) => o.eq(f.slug, slug),
      columns: {
        checkpoint_id: true,
      },
    });

    
    if (translate && translate.checkpoint_id) {
      const res = await this._drizzle.db().query.checkpoints.findFirst({
        // where: (fields, { eq }) => eq(fields.id, id),
        with: {
          translates: {
            where: (f, o) => o.eq(f.lang, lang),
          },
          category: {
            columns: { id: true },
            with: {
              translates: {
                where: lang
                  ? (fields, operators) => operators.eq(fields.lang, lang)
                  : undefined,
              },
            },
          },
          province: {
            columns: { id: true },
            with: {
              translates: {
                where: lang
                  ? (fields, operators) => operators.eq(fields.lang, lang)
                  : undefined,
              },
            },
          },
        },
        where: (f, o) => o.eq(f.id, translate.checkpoint_id!),
      });

      if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນແຂວງນີ້' });

      return res;
    } else {
      return undefined;
    }
  }
}
