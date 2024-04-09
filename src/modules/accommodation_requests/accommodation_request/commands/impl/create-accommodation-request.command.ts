import { CreateAccommodationRequestDtoType } from '../../dtos/create-accommodation-request.dto';

export class CreateAccommodationRequestCommand {
  constructor(public readonly input: CreateAccommodationRequestDtoType) {}
}
