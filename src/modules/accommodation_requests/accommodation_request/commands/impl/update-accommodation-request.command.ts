import { UpdateAccommodationRequestDtoType } from '../../dtos/update-accommodation-request.dto';

export class UpdatedAccommodationCommand {
  constructor(
    public readonly id: number,
    public readonly input: UpdateAccommodationRequestDtoType,
  ) {}
}
