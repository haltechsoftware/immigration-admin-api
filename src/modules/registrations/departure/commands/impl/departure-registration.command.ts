import { DepartureRegistrationDtoType } from "../../dto/departure-registration.dto";

export default class DepartureRegistrationCommand {
  constructor(public readonly input: DepartureRegistrationDtoType) {}
}