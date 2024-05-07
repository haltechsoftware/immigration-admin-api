import { NumberDtoType } from '../../../dtos/number.dto';

export class IncrementTouristEnterCommand {
  constructor(public readonly input: NumberDtoType) {}
}
