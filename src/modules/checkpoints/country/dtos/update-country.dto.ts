import {
  Output,
  StringSchema,
  custom,
  merge,
  object,
  omit,
  safeParse,
  string,
  transform,
} from 'valibot';
import {
  CountryTranslateDto,
  CountryTranslateDtoType,
} from './country-translate.dto';
import { CreateCountryDto } from './create-country.dto';

const UpdateCountryDto = merge([
  omit(CreateCountryDto, ['lo', 'en', 'zh_cn']),
  object({
    lo: transform<StringSchema<string>, CountryTranslateDtoType>(
      string(),
      (input) => JSON.parse(input),
      [custom((input) => safeParse(CountryTranslateDto, input).success)],
    ),
    en: transform<StringSchema<string>, CountryTranslateDtoType>(
      string(),
      (input) => JSON.parse(input),
      [custom((input) => safeParse(CountryTranslateDto, input).success)],
    ),
    zh_cn: transform<StringSchema<string>, CountryTranslateDtoType>(
      string(),
      (input) => JSON.parse(input),
      [custom((input) => safeParse(CountryTranslateDto, input).success)],
    ),
  }),
]);

type UpdateCountryDtoType = Output<typeof UpdateCountryDto>;

export { UpdateCountryDto, UpdateCountryDtoType };
