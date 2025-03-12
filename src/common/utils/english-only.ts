import { custom } from "valibot";

export default (name: string) =>
  custom(
    (input: string) => /^[A-Za-z0-9\s.,!?'-]+$/.test(input),
    `${name} must be in English.`,
  );
