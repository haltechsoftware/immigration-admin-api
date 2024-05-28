import { UpdateLostPassportDtoType } from '../../dtos/update-lost-passport.dto';

export class UpdatedLostPassportCommand {
  constructor(
    public readonly id: number,
    public readonly input: UpdateLostPassportDtoType,
  ) {}
}
