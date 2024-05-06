import { CreateLawDtoType } from '../../dto/create-law.dto';

export default class CreateLawCommand {
  constructor(public readonly dto: CreateLawDtoType) {}
}
