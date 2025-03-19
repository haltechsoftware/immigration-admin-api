import { sql } from "drizzle-orm";
import { checkpoints } from "src/modules/checkpoints/entities";
import { GetAllToClientCountryCommand } from "../impl/get-all-to-client.country";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";

@QueryHandler(GetAllToClientCountryCommand)
export class QueryGetAllClientCountryHandler implements IQueryHandler<any> {
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute(query: GetAllToClientCountryCommand): Promise<any> {
    const db = this._drizzle.db(); // CALL the function to get the instance

    // Explicitly typing 'country' as a union of string literals
    const countryList: { country: "vietnam" | "thailand" | "cambodia" | "myanmar" | "china" | "airport" }[] = [
      { country: 'vietnam' },
      { country: 'thailand' },
      { country: 'cambodia' },
      { country: 'myanmar' },
      { country: 'china' },
      { country: 'airport' },
    ];

    // Query the database for country counts
    const result = await db
      .select({
        country: checkpoints.country,
        count: sql<number>`COUNT(${checkpoints.id})`.as("count"),
      })
      .from(checkpoints)
      .groupBy(checkpoints.country)
      .execute();

    // Map results to predefined countryList
    const resultMap = new Map(result.map((row) => [row.country, row.count]));

    const responseData = countryList.map((item) => ({
      country: item.country,
      count: resultMap.get(item.country) || 0,
    }));

    return {
      data: responseData,
      total: result.reduce((sum, row) => sum + row.count, 0),
    };
  }
}
