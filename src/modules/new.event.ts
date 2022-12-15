import { Events } from "@entities/events";
import { Exams } from "@entities/exams";
import IRepository from "@repository/IRepository";
import { eventType } from "eventType";
import Get from "./di";
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
  if (!Array.isArray(data)) return [];

  const repository: IRepository<Events | Exams> = Get.get("Repository");
  const recentEvent = data.filter((event) => validCursusEvent(event)).sort((a: eventType, b: eventType) => b.id - a.id);
  const nowEvent = await repository.findOne();

  return nowEvent ? recentEvent.filter((event) => event.id > nowEvent.id) : [recentEvent[0]];
};

export default newEvent;
