import { eq, or, sql } from 'drizzle-orm';
import { roles } from 'src/modules/users/entities';
import { db } from '../main';

export default async () => {
  const total = await db
    .select({ value: sql<number>`count(*)`.as('value') })
    .from(roles)
    .where(or(eq(roles.id, 1), eq(roles.id, 2)));

  if (total[0].value < 2) {
    await db.insert(roles).values([
      { id: 1, name: 'dev', description: 'ນັກພັດທະນາ', is_default: true },
      { id: 2, name: 'admin', description: 'ຜູ້ດູແລລະບົບ', is_default: true },
    ]);
  }
};
