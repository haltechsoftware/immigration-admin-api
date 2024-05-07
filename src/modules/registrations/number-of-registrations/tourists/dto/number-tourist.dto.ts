import { number, object, Output } from 'valibot';

export const NumberTouristDto = object({
  number: number(),
});

export type NumberTouristDtoType = Output<typeof NumberTouristDto>;
