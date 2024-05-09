import { NumberDtoType } from '../../../dtos/number.dto';

export class DecrementTouristEnterCommand {
  constructor(public readonly input: NumberDtoType) {}
}
