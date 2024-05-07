import { NumberDtoType } from '../../../dtos/number.dto';

export class IncrementRegisterEnterCommand {
  constructor(public readonly input: NumberDtoType) {}
}
