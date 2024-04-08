import { VerifyArrivalCodeDtoType } from '../../dto/verify-arrival-code.dto';

export default class VerifyArrivalCodeCommand {
  constructor(public readonly input: VerifyArrivalCodeDtoType) {}
}
