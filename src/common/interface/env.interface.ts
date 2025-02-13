export default interface IEnv {
  DB_HOST: string;
  DB_USER: string;
  DB_PASS: string;
  DB_DATABASE: string;
  REDIS_URL: string;

  JWT_SECRET: string;
}
