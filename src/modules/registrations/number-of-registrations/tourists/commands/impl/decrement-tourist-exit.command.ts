import { NumberDtoType } from '../../../dtos/number.dto';

export class DecrementTouristExitCommand {
  constructor(public readonly input: NumberDtoType) {}
}
