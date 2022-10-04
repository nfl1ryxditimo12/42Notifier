import axios, { AxiosError, AxiosResponse } from "axios";
import env from "@modules/env";
import { slackError } from "@modules/slack";
import Logger from "./logger";

interface HttpRequestParam {
  path: string;
  method?: string;
  headers?: Record<string, string | number | boolean>;
  params?: Record<string, any>;
}

export class HttpRequest {
  url: string;
  method: string;
  headers: Record<string, string | number | boolean>;
  params: Record<string, string | number | boolean>;
  timeout: number;

  constructor(param: HttpRequestParam) {
    this.url = env.ftConfig.url + param.path;
    this.method = param.method ? param.method : "get";
    this.headers = param.headers ? param.headers : {};
    this.params = param.params ? param.params : {};
    this.timeout = 10000;
  }
}

class Http {
  async connect(request: HttpRequest): Promise<any> {
    const logger = new Logger(request.method === "post" ? "auth" : "event");
    return await axios(request)
      .then((res: AxiosResponse) => {
        logger.latency(res.status, new Date().getTime());
        return res.data;
      })
      .catch((err: AxiosError) => {
        err.stack = new Error().stack;
        throw err;
      });
  }
}

export default Http;
