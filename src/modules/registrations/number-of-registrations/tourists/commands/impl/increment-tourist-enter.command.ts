import { NumberTouristDtoType } from '../../dto/number-tourist.dto';

export class IncrementTouristEnterCommand {
  constructor(public readonly input: NumberTouristDtoType) {}
}
