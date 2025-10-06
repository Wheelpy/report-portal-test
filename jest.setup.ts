export {};

declare global {
  var credentials: {
    USERNAME?: string;
    PASSWORD?: string;
    ENV: string;
  };
}

global.credentials = {
  USERNAME: process.env.RP_USER_PROD,
  PASSWORD: process.env.RP_PASSWORD_PROD,
  ENV: "prod",
};
