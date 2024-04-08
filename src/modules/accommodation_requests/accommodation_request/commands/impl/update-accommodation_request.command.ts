import { UpdateAccommodationRequestDtoType } from '../../dtos/update-accommodation_request.dto';

export class UpdatedAccommodationCommand {
  constructor(
    public readonly id: number,
    public readonly input: UpdateAccommodationRequestDtoType,
  ) {}
}
