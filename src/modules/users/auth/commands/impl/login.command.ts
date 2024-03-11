import { LoginDtoType } from '../../dtos/login.dto';

export default class LoginCommand {
  constructor(public readonly dto: LoginDtoType) {}
}
