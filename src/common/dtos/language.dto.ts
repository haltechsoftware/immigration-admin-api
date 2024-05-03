import { object, special } from 'valibot';

export const LanguageDto = object({
  lang: special<'lo' | 'en' | 'zh_cn'>(
    (input) => input === 'lo' || input === 'en' || input === 'zh_cn',
    'ລະຫັດພາສາບໍ່ຖືກຕ້ອງ',
  ),
});
