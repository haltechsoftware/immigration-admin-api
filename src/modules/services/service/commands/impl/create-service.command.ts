import { CreateServiceDtoType } from '../../dtos/create-service.dto';

export class CreateServiceCommand {
  constructor(public readonly input: CreateServiceDtoType) {}
}
