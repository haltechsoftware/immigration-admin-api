import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
    customAsync,
    maxLength,
    minLength,
    number,
    objectAsync,
    string,
    stringAsync,
} from 'valibot';

export const ProvinceTranslateSchema = objectAsync({
    id: number('ຈະຕ້ອງເປັນ number'),
    name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
        minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
        customAsync(async function (input: string) {
            const drizzle:DrizzleService = RequestContext.currentContext.req.drizzle;
            const res = await drizzle.db().query.provinceTranslate.findFirst({
                where: ({ name }, { eq }) => eq(name, input),
            });
            return res ? false : true;
        }, 'ແຂວງນີ້ມີໃນລະບົບແລ້ວ'),
    ]),
    description: string('ຈະຕ້ອງເປັນ string'),
});
