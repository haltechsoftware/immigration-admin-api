import { VerifyDepartureCodeDtoType } from '../../dto/verify-departure-code.dto';

export default class ScanDepartureCodeCommand {
  constructor(public readonly input: VerifyDepartureCodeDtoType) {}
}
