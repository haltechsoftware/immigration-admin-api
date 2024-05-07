import { NumberTouristDtoType } from '../../dto/number-tourist.dto';

export class DecrementTouristExitCommand {
  constructor(public readonly input: NumberTouristDtoType) {}
}
