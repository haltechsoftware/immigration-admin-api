import CreatePopupHandler from "./create-popup.handler";
import DeletePopupHandler from "./delete-popup.handler";
import UpdatePopupHandler from "./update-popup.handler";
import UpdatePrivatePopupHandler from "./update-private.handler";

const popupCommandHandlers = [
    CreatePopupHandler,
    UpdatePopupHandler,
    DeletePopupHandler,
    UpdatePrivatePopupHandler
];
  
export default popupCommandHandlers;