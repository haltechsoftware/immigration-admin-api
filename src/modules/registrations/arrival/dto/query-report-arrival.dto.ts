import {
  object,
  optional,
  string,
  transform,
  merge,
  Output,
  special,
  minLength,
  regex,
} from 'valibot';
import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { BadRequestException } from '@nestjs/common';

// Field-level validation using transform
const is_verified = optional(
  special<'verified' | 'no_verified'>(
    (input) => input === 'verified' || input === 'no_verified' || input === '',
    'Invalid type: Expected verified or no_verified',
  ),
);

const black_list = optional(
  special<'available' | 'unavailable'>(
    (input) => input === 'available' || input === 'unavailable' || input === '',
    'Invalid type: Expected available or unavailable',
  ),
);

const start_date = string('start_date must be a string', [
  minLength(1, 'Please enter start_date.'),
  regex(/^\d{4}-\d{2}-\d{2}$/, 'start_date must be in YYYY-MM-DD format'),
]);

const end_date = string('end_date must be a string', [
  minLength(1, 'Please enter end_date.'),
  regex(/^\d{4}-\d{2}-\d{2}$/, 'end_date must be in YYYY-MM-DD format'),
]);

// Combine all fields
const baseQueryReportArrivalDto = object({
  entry_name: optional(string()),
  passport_number: optional(string()),
  visa_number: optional(string()),
  verification_code: optional(string()),
  is_verified,
  black_list,
  start_date,
  end_date,
});

// Final schema with cross-field validation
const queryReportArrivalDto = transform(
  merge([OffsetBasePaginateDto, baseQueryReportArrivalDto]),
  (data) => {
    const { start_date, end_date } = data;

    const hasStart = typeof start_date === 'string' && start_date.trim() !== '';
    const hasEnd = typeof end_date === 'string' && end_date.trim() !== '';

    if (hasStart && hasEnd) {
      const start = Date.parse(start_date);
      const end = Date.parse(end_date);

      if (isNaN(start)) {
        throw new BadRequestException('start_date is not a valid date');
      }
      if (isNaN(end)) {
        throw new BadRequestException('end_date is not a valid date');
      }

      if (end < start) {
        throw new BadRequestException('end_date must not be than start_date');
      }

      const maxEndDate = new Date(start);
      maxEndDate.setMonth(maxEndDate.getMonth() + 3);

      if (end > maxEndDate.getTime()) {
        throw new BadRequestException(
          `date range must not exceed 3 months. You can select up to ${getMaxEndDate(
            start_date,
          )}.`,
        );
      }
    }

    return data;
  },
);

function getMaxEndDate(startDateStr: string): string {
  const startDate = new Date(startDateStr);

  // ບວກ 3 ເດືອນຈາກ startDate
  const maxEndDate = new Date(startDate);
  maxEndDate.setMonth(maxEndDate.getMonth() + 3);

  // ຄືນຮູບເເບບ YYYY-MM-DD
  return maxEndDate.toISOString().split('T')[0];
}

// Output type
type QueryReportArrivalDtoType = Output<typeof queryReportArrivalDto>;

export { queryReportArrivalDto, type QueryReportArrivalDtoType };
