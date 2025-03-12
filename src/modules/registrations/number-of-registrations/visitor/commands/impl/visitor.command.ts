import { NumberDtoType } from '../../../dtos/number.dto';

export class VisitorCommand {
  constructor(public readonly input: NumberDtoType) {}
}
