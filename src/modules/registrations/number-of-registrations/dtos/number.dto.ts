import { number, object, Output } from 'valibot';

export const NumberDto = object({
  number: number(),
});

export type NumberDtoType = Output<typeof NumberDto>;
