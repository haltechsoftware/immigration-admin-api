import { GetPopupByIdHandler } from './get-popup-by-id.repository';
import { GetPopupClientHandler } from './get-popup-client.repository';
import { GetPopupHandler } from './get-popup.repository';

const popupQueryHandlers = [
  GetPopupByIdHandler,
  GetPopupHandler,
  GetPopupClientHandler,
];

export default popupQueryHandlers;
