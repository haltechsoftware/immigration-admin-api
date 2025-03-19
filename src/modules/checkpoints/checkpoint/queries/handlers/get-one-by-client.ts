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
    params: id,
    query: { lang },
  }: GetOneClientCheckpointCommand): Promise<any> {
    console.log(lang);
    const res = await this._drizzle.db().query.checkpoints.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: {
          where: lang
            ? (fields, operators) => operators.eq(fields.lang, lang)
            : undefined,
        },
        category: {
          columns: { id: true },
          with: {
            translates: {
              //   columns: {
              //     id: true,
              //     title: true,
              //     lang: true,
              //   },
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
              //   columns: {
              //     id: true,
              //     name: true,
              //     lang: true,
              //   },
              where: lang
                ? (fields, operators) => operators.eq(fields.lang, lang)
                : undefined,
            },
          },
        },
      },
    });

    if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນແຂວງນີ້' });

    return res;
  }
}
