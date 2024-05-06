import { maxLength, minLength, object, Output, string } from 'valibot';

const CheckVerifyCodeDto = object({
  code: string([minLength(1), maxLength(10)]),
});

type CheckVerifyCodeDtoType = Output<typeof CheckVerifyCodeDto>;

export { CheckVerifyCodeDto, type CheckVerifyCodeDtoType };
