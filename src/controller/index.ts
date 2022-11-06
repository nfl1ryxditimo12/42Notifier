import axios from "axios";
import { getCustomRepository, TypeORMError } from "typeorm";

import env from "@modules/env";
import newEvent from "@modules/new.event";
import slack, { slackError } from "@modules/slack";
import { EventRepo } from "@repository/event.repository";
import { ExamRepo } from "@repository/exam.repository";
import Http, { HttpRequest } from "@modules/http";
import Get from "@modules/di";
import { eventType } from "eventType";
import IRepository from "@repository/IRepository";
import { Events } from "@entities/events";
import { Exams } from "@entities/exams";
import { Token } from "@modules/token";

const checkData = async (value: Array<any>) => {
  const repo: IRepository<Events | Exams> =
    env.nodeConfig.type === "event" ? getCustomRepository(EventRepo) : getCustomRepository(ExamRepo);
  const newEventValue: eventType[] = await newEvent(value);

  newEventValue.map(async (event) => {
    await repo
      .createOne(event)
      .then(() => slack(event))
      .catch((err: TypeORMError) => {
        throw err;
      });
  });
};

const controller = async () => {
  const token: Token = Get.get("Token");
  const http: Http = Get.get("Http");
  const requestParam = new HttpRequest({
    method: "get",
    path: env.ftConfig.path,
    headers: { Authorization: `Bearer ${token.token}` },
  });
  const events = await http.connect(requestParam);

  await checkData(events);
};

export default controller;
