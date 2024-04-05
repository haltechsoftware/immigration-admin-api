import { VerifyDepartureCodeDtoType } from '../../dto/verify-departure-code.dto';

export default class VerifyDepartureCodeCommand {
  constructor(public readonly input: VerifyDepartureCodeDtoType) {}
}
