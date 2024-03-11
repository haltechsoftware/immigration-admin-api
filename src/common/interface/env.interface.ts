export default interface IEnv {
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SSL: boolean | object | 'require' | 'allow' | 'prefer' | 'verify-full';

  JWT_SECRET: string;
}
