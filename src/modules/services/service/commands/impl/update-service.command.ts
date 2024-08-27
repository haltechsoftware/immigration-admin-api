import { UpdateServiceDtoType } from '../../dtos/update-service.dto';

export class UpdatedServiceCommand {
  constructor(
    public readonly id: number,
    public readonly input: UpdateServiceDtoType,
  ) {}
}
