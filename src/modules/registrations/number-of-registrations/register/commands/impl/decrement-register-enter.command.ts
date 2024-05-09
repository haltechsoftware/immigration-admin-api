import { NumberDtoType } from '../../../dtos/number.dto';

export class DecrementRegisterEnterCommand {
  constructor(public readonly input: NumberDtoType) {}
}
