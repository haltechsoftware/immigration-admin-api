import { count } from 'drizzle-orm';
import { db } from '../main';
import { provinces } from 'src/modules/checkpoints/entities';

export default async () => {
  const total = await db.select({ value: count() }).from(provinces);

  if (total[0].value < 36) {
    await db.insert(provinces).values([
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 5,
      },
      {
        id: 6,
      },
      {
        id: 7,
      },
      {
        id: 8,
      },
      {
        id: 9,
      },
      {
        id: 10,
      },
      {
        id: 11,
      },
      {
        id: 12,
      },
      {
        id: 13,
      },
      {
        id: 14,
      },
      {
        id: 15,
      },
      {
        id: 16,
      },
      {
        id: 17,
      },
      {
        id: 18,
      },
     
    ]);
  }
};
