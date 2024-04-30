import { inArray, sql } from 'drizzle-orm';
import { roles } from 'src/modules/users/entities';
import { db } from '../main';

export default async () => {
  const total = await db
    .select({ value: sql<number>`count(*)`.as('value') })
    .from(roles)
    .where(inArray(roles.id, [1, 2, 3]));

  if (total[0].value < 3) {
    await db.insert(roles).values([
      { id: 1, name: 'dev', description: 'ນັກພັດທະນາ', is_default: true },
      { id: 2, name: 'admin', description: 'ຜູ້ດູແລລະບົບ', is_default: true },
      {
        id: 3,
        name: 'admin-hotel',
        description: 'ຜູ້ດູແລໂຮງແຮມ',
        is_default: true,
      },
    ]);
  }
};
