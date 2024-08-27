import { count } from 'drizzle-orm';
import { provinces } from 'src/modules/checkpoints/entities';
import { provinceCountry } from 'src/modules/checkpoints/entities/province_country';
import { db } from '../main';

export default async () => {
  const total = await db.select({ value: count() }).from(provinces);

  if (total[0].value < 18) {
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

  const provinceTotal = await db
    .select({ value: count() })
    .from(provinceCountry);

  if (provinceTotal[0].value < 26) {
    await db.insert(provinceCountry).values([
      { country: 'vietnam', provinceId: 12 },
      { country: 'vietnam', provinceId: 10 },
      { country: 'vietnam', provinceId: 7 },
      { country: 'vietnam', provinceId: 16 },
      { country: 'vietnam', provinceId: 17 },
      { country: 'vietnam', provinceId: 8 },
      { country: 'vietnam', provinceId: 14 },
      { country: 'vietnam', provinceId: 13 },
      { country: 'vietnam', provinceId: 15 },
      { country: 'vietnam', provinceId: 3 },

      { country: 'cambodia', provinceId: 6 },
      { country: 'cambodia', provinceId: 3 },

      { country: 'thailand', provinceId: 4 },
      { country: 'thailand', provinceId: 5 },
      { country: 'thailand', provinceId: 18 },
      { country: 'thailand', provinceId: 1 },
      { country: 'thailand', provinceId: 17 },
      { country: 'thailand', provinceId: 8 },
      { country: 'thailand', provinceId: 14 },
      { country: 'thailand', provinceId: 13 },
      { country: 'thailand', provinceId: 6 },

      { country: 'myanmar', provinceId: 9 },
      { country: 'myanmar', provinceId: 4 },

      { country: 'china', provinceId: 12 },
      { country: 'china', provinceId: 11 },
      { country: 'china', provinceId: 9 },
    ]);
  }
};
