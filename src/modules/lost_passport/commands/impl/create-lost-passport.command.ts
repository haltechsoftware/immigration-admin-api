import { CreateLostPassportDtoType } from '../../dtos/create-lost-passport.dto';

export class CreateLostPassportCommand {
  constructor(public readonly input: CreateLostPassportDtoType) {}
}
