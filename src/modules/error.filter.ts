import { AxiosError } from "axios";
import { TypeORMError } from "typeorm";

import { slackError } from "@modules/slack";
import Logger from "@modules/logger";

const ErrorFilter = (error: AxiosError | TypeORMError | any) => {
  const status = error instanceof AxiosError ? error.response.status : 500;
  const type = error instanceof AxiosError ? "API" : error instanceof TypeORMError ? "Database" : "Unknown";

  new Logger(type).error(error).catch();

  if (
    (error instanceof AxiosError && (status === 429 || status >= 500)) ||
    (error instanceof TypeORMError && error["code"] === "ER_DUP_ENTRY")
  )
    return;

  slackError({
    statusCode: status,
    message: error.message,
    stack: error.stack,
  }).catch();
};

export default ErrorFilter;
