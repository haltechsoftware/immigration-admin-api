import { VerifyArrivalCodeDtoType } from '../../dto/verify-arrival-code.dto';

export default class ScanArrivalCodeCommand {
  constructor(public readonly input: VerifyArrivalCodeDtoType) {}
}
