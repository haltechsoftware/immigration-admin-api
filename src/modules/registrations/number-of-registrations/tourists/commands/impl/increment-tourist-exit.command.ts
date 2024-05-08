import { NumberDtoType } from '../../../dtos/number.dto';

export class IncrementTouristExitCommand {
  constructor(public readonly input: NumberDtoType) {}
}
