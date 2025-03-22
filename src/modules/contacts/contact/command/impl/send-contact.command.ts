import { SendContactDtoType } from "../../dto/send-contact.dto";

export default class SendContactCommand {
    constructor(
        public readonly input: SendContactDtoType,
    ) {}
}