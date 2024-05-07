import { NumberTouristDtoType } from '../../dto/number-tourist.dto';

export class DecrementTouristEnterCommand {
  constructor(public readonly input: NumberTouristDtoType) {}
}
