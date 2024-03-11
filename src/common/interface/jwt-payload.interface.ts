export interface IJwtPayload {
  token_id: string;
  sub: string;
  roles?: string[];
  permissions?: string[];
}
