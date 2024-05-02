import { GetByIdContactQueryHandler } from "./get-contact-by-id.repository";
import { GetContactHandler } from "./get-contact.repository";

const contactQueryHandlers = [GetContactHandler, GetByIdContactQueryHandler];

export default contactQueryHandlers;