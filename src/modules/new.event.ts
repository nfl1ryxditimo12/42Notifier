import { Events } from "@entities/events";
import { Exams } from "@entities/exams";
import { EventRepo } from "@repository/event.repository";
import { ExamRepo } from "@repository/exam.repository";
import IRepository from "@repository/IRepository";
import { eventType } from "eventType";
import { getCustomRepository } from "typeorm";
import env from "./env";

const validCursusEvent = (event: eventType) => {
  const valid =
    env.nodeConfig.type === "event"
      ? event["cursus_ids"][0] === 21 && event["campus_ids"][0] === 29 && event.description.indexOf("test") === -1
      : event.cursus[0].slug === "42cursus" && event.name.indexOf("test") === -1 && event.location.indexOf("test") === -1;

  return (
    valid &&
    event.name.indexOf("test") === -1 &&
    event.location.indexOf("test") === -1 &&
    event.name.indexOf("DO NOT") === -1 &&
    event.name.indexOf("do not") === -1 &&
    event.name.indexOf("TIG") === -1 &&
    event.name.indexOf("Never") === -1 &&
    event.name.indexOf("Don't") === -1
  );
};

const newEvent = async (data: Array<eventType>): Promise<eventType[]> => {
  const repo: IRepository<Events | Exams> =
    env.nodeConfig.type === "event" ? getCustomRepository(EventRepo) : getCustomRepository(ExamRepo);
  const recentEvent = data.filter((event) => validCursusEvent(event)).sort((a: eventType, b: eventType) => b.id - a.id);
  const nowEvent = await repo.findOne();
  return nowEvent ? recentEvent.filter((event) => event.id > nowEvent.id) : [recentEvent[0]];
};

export default newEvent;
