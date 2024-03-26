import { GetPopupByIdHandler } from './get-popup-by-id.repository';
import { GetPopupHandler } from './get-popup.repository';

const popupQueryHandlers = [GetPopupByIdHandler, GetPopupHandler];

export default popupQueryHandlers;
