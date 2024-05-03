import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';

@Injectable()
export class AdminHotelRepository {
  constructor(private readonly _drizzle: DrizzleService) {}
}
