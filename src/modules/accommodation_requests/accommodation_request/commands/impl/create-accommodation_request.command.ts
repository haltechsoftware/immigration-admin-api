import { CreateAccommodationRequestDtoType } from '../../dtos/create-accommodation_request.dto';

export class CreateAccommodationRequestCommand {
  constructor(public readonly input: CreateAccommodationRequestDtoType) {}
}
