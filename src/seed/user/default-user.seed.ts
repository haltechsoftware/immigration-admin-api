import { hashSync } from 'bcrypt';
import { eq, or, sql } from 'drizzle-orm';
import { profiles, users, usersToRoles } from 'src/modules/users/entities';
import { db } from '../main';

export default async () => {
  const existUser = await db
    .select({ value: sql<number>`count(*)`.as('value') })
    .from(users)
    .where(or(eq(users.id, 1), eq(users.id, 2)));

  if (existUser[0].value < 2) {
    await db
      .insert(users)
      .values([
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
      ])
      .returning()
      .then(async (val) => {
        const profileInserts: (typeof profiles.$inferInsert)[] = [];
        const userToRoleInserts: (typeof usersToRoles.$inferInsert)[] = [];

        val.forEach((user, idx) => {
          profileInserts.push({
            first_name: idx === 0 ? 'dev' : 'admin',
            last_name: idx === 0 ? 'developer' : 'admin',
            user_id: user.id,
          });

          userToRoleInserts.push({
            user_id: user.id,
            role_id: idx === 0 ? 1 : 2,
          });
        });

        await db.insert(profiles).values(profileInserts);
        await db.insert(usersToRoles).values(userToRoleInserts);
      });
  }
};
