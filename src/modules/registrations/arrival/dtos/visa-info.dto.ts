import { object, optional, string } from 'valibot';

export const VisaInfoSchema = object({
  visaCategory: optional(string('Visa must be a string.')),
  no: optional(string('Visa No must be a string.')),
  date_of_issue: optional(string('Date of issue must be a string.')),
  place_of_issue: optional(string('Place of issue must be a string.')),
  // image: optional(string('image must be a string')),
});
