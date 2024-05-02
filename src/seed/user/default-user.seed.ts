import { hashSync } from 'bcrypt';
import { inArray, sql } from 'drizzle-orm';
import { profiles, users, usersToRoles } from 'src/modules/users/entities';
import { db } from '../main';

export default async () => {
  const existUser = await db
    .select({ value: sql<number>`count(*)`.as('value') })
    .from(users)
    .where(inArray(users.id, [1, 2, 3]));

  if (existUser[0].value < 3) {
    await db.insert(users).values([
      {
        id: 1,
        email: 'dev@gmail.com',
        password: hashSync('devPassword', 10),
      },
      {
        id: 2,
        email: 'admin@gmail.com',
        password: hashSync('adminPassword', 10),
      },
      {
        id: 3,
        email: 'adminHotel@gmail.com',
        password: hashSync('password', 10),
      },
    ]);

    const res = await db
      .select()
      .from(users)
      .where(inArray(users.id, [1, 2, 3]));

    const profileInserts: (typeof profiles.$inferInsert)[] = [];
    const userToRoleInserts: (typeof usersToRoles.$inferInsert)[] = [];

    res.forEach((user, idx) => {
      profileInserts.push({
        first_name: idx === 0 ? 'dev' : idx === 1 ? 'admin' : 'admin',
        last_name: idx === 0 ? 'developer' : idx === 1 ? 'admin' : 'hotel',
        user_id: user.id,
      });

      userToRoleInserts.push({
        user_id: user.id,
        role_id: idx + 1,
      });
    });

    await db.insert(profiles).values(profileInserts);
    await db.insert(usersToRoles).values(userToRoleInserts);
  }
};
