import { NumberDtoType } from '../../../dtos/number.dto';

export class IncrementRegisterExitCommand {
  constructor(public readonly input: NumberDtoType) {}
}
