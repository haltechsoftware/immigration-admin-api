import { GetPopupByIdHandler } from "./get-popup-by-id.repository";
import { GetPopupHandler } from "./get-popup.repository";
import { GetReportPopupHandler } from "./report-popup.repository";

const popupQueryHandlers = [GetPopupByIdHandler, GetPopupHandler, GetReportPopupHandler];

export default popupQueryHandlers;
