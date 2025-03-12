import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { and, count, eq, gt, gte, lt, lte, or } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { banners } from 'src/modules/banners/entities';
import { GetAllBannerQuery } from '../impl/get-all.banner';
import { GetAllClientBannerQuery } from '../impl/get-all-client-banner';

@QueryHandler(GetAllClientBannerQuery)
export class GetAllClientBannerQueryHandler implements IQueryHandler<GetAllClientBannerQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    query: { lang },
  }: GetAllClientBannerQuery): Promise<any> {
  
    // Perform the main query with 'with' for related translates
    const res = await this.drizzle.db().query.banners.findMany({
      columns: {
        id: true,
        image: true,
        link: true,
      },
      with: {
        translates: {
          columns: { id: true, lang: true, title: true, description: true },
          where: (fields, operators) => operators.eq(fields.lang, lang), // You may pass lang variable
        },
      },
      where: (fields, operators) =>
        operators.and(
          operators.eq(fields.is_private, false),
          operators.lte(fields.start_time, format(new Date(), DateTimeFormat.Timestamp)),
          operators.gte(fields.end_time, format(new Date(), DateTimeFormat.Timestamp)),
        ),
      });
  
    // Get the total count (without 'with' here)
    const total = await this.drizzle
      .db()
      .select({ value: count() })
      .from(banners);
  
    // Map the results to format the translates data
    const mappedData = res.map((val) => ({
      ...val,
      translate: val.translates[0], // Assuming you only want the first translate item
      translates: undefined, // Remove the full translates array
    }));
  
    return {
      data: mappedData,
      total: total[0]?.value ?? 0,
    };
  }
  
}