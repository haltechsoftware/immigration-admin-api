import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
    customAsync,
    minLength,
    number,
    objectAsync,
    string,
    stringAsync,
} from 'valibot';

export const CheckpointTranslateSchema = objectAsync({
    id: number('ຈະຕ້ອງເປັນ number'),
    title: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
        customAsync(async function (input: string) {
            const drizzle:DrizzleService = RequestContext.currentContext.req.drizzle;
            const checkpoint_category = input.split(',').map((val) => String(val));
            const res = await drizzle.db().query.checkpointCategoryTranslate.findMany({
                where: ({ title }, { inArray }) => inArray(title, checkpoint_category),
            });
            return res.length === 0;
        }, 'ຊື່ປະເພດດ່ານນີ້ມີໃນລະບົບແລ້ວ'),
    ]),
    description: string('ຈະຕ້ອງເປັນ string')
});
