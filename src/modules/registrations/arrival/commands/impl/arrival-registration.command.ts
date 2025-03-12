import { ArrivalRegistrationDtoType } from "../../dtos/arrival-registration.dto";

export default class ArrivalRegistrationCommand {
  constructor(public readonly input: ArrivalRegistrationDtoType) {}
}
