import pino from "pino";
import { apiEnv } from "./env";

export const rootLogger = pino({
  level: apiEnv.LOG_LEVEL ?? "trace",
});
