import { Events } from "@entities/events";
import { Exams } from "@entities/exams";
import { EventRepo } from "@repository/event.repository";
import { ExamRepo } from "@repository/exam.repository";
import { eventType } from "eventType";
import { getCustomRepository } from "typeorm";

const eventCursusValid = (event: eventType, flag: string) => {
  const valid =
    flag === "event"
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

const isNewEvent = (recentEvent: Array<eventType>, nowEvent: Events | Exams, flag: string) => {
  return recentEvent.filter((event) => eventCursusValid(event, flag) && event.id > nowEvent.id);
};

const newEvent = async (data: Array<eventType>, flag: string) => {
  const recentEvent = data.sort((a: eventType, b: eventType) => b.id - a.id);
  const eventRepo = getCustomRepository(EventRepo);
  const examRepo = getCustomRepository(ExamRepo);
  const nowEvent = flag === "event" ? await eventRepo.findOneEvent() : await examRepo.findOneExam();

  return isNewEvent(recentEvent, nowEvent, flag);
};

export default newEvent;
