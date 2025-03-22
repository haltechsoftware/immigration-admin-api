import DeleteContactHandler from "./delete-contact.handler";
import SendContactHandler from "./send-contact.handler";

const contactCommandHandlers = [
    DeleteContactHandler,
    SendContactHandler,
];
  
export default contactCommandHandlers;