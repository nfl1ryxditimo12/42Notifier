import Http from "@modules/http";
import { Token } from "@modules/token";
import env from "@modules/env";
import { getCustomRepository } from "typeorm";
import { EventRepo } from "@repository/event.repository";
import { ExamRepo } from "@repository/exam.repository";

export const dependencyInject = () => {
  Get.put("Http", new Http());
  Get.put("Token", new Token());
  Get.put("Repository", env.nodeConfig.type === "event" ? getCustomRepository(EventRepo) : getCustomRepository(ExamRepo));
};

class Get {
  private static _repos = new Map<string, any>();

  static put<T>(name: string, obj: T) {
    this._repos.set(name, obj);
  }

  static get<T>(name: string): T {
    if (this._repos.has(name)) {
      return this._repos.get(name);
    } else {
      throw Error(`${name} is not put`);
    }
  }
}

export default Get;
