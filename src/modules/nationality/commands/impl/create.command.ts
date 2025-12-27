import { CreateNationalityDtoType } from '../../dto/create.dto';

export default class CreateNationalityCommand {
  constructor(public readonly dto: CreateNationalityDtoType) {}
}
