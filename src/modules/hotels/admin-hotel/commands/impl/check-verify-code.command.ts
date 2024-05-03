import { CheckVerifyCodeDtoType } from '../../dtos/check-verify-code.dto';

export class CheckVerifyCodeCommand {
  constructor(public readonly data: CheckVerifyCodeDtoType) {}
}
