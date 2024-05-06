export interface IJwtPayload {
  token_id: string;
  sub: string;
  hotel_id?: number;
  roles?: string[];
  permissions?: string[];
}
