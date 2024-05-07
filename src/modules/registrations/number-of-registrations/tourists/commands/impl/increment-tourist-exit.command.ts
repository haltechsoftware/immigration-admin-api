import { NumberTouristDtoType } from '../../dto/number-tourist.dto';

export class IncrementTouristExitCommand {
  constructor(public readonly input: NumberTouristDtoType) {}
}
