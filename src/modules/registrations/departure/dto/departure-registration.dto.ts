import englishOnly from "src/common/utils/english-only";
import { maxLength, minLength, object, omit, Output, string } from "valibot";
import { PersonalInfoSchema } from "../../arrival/dtos/personal-info.dto";
import { PassportInfoSchema } from "../../arrival/dtos/passport-info.dto";


const DepartureRegistrationDto = object({
    departure_point: string('must be a string.', [
        minLength(
          1,
          'Please enter Departure point',
        ),
        maxLength(
          255,
          'Please enter Departure point with a maximum length of 255 characters.',
        ),
        englishOnly('departure point')
    ]),
      personal_info: omit(PersonalInfoSchema, ["race"]),
      last_leaving: string('Last address in Laos must be a string.', [
          minLength(
            1,
            'Please enter Last address in Laos',
          ),
          maxLength(
            255,
            'Please enter Last address in Laos with a maximum length of ${255} characters.',
          ),
          englishOnly('Last address'),
      ]),

      passport_info: omit(PassportInfoSchema, ["people_image"]),
});

type DepartureRegistrationDtoType = Output<typeof DepartureRegistrationDto>;

export { DepartureRegistrationDto, DepartureRegistrationDtoType };