import { NumberDtoType } from '../../../dtos/number.dto';

export class DecrementRegisterExitCommand {
  constructor(public readonly input: NumberDtoType) {}
}
