import { LoginHandler } from './login.handler';
import { LogoutHandler } from './logout.handler';
import { RemoveSessionHandler } from './remove-sessiom.handler';

const authHandlers = [LoginHandler, RemoveSessionHandler, LogoutHandler];

export default authHandlers;
