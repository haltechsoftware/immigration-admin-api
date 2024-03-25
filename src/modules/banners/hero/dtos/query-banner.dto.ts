import { Output, customAsync, object, objectAsync, string, stringAsync } from 'valibot';

//format
const isValidDateFormat = (input: string, format: string): boolean => {
    return !!input.match(new RegExp(format));
};

const QueryBannerDto = object({
    title: string('ບໍ່ສາມາດຫວ່າງເປົ່າໄດ້'),
    startTime: string('Event date is required.'),

    endTime: string('Event date is required.'),
    lang: string('ບໍ່ສາມາດຫວ່າງໄດ້')
});

type QueryBannerType = Output<typeof QueryBannerDto>;

export { QueryBannerDto, type QueryBannerType };
