import { WebClient } from "@slack/web-api";
import { getCustomRepository } from "typeorm";
import axios from "axios";

import env from "@modules/env";
import { content } from "@modules/content";
import { EventRepo } from "@repository/event.repository";
import { ExamRepo } from "@repository/exam.repository";
import { eventType } from "eventType";
import datetime from "./datetime";
import { slackTypes } from "slackTypes";
import IRepository from "@repository/IRepository";
import { Events } from "@entities/events";
import { Exams } from "@entities/exams";
import Logger from "./logger";

const slack = (event: eventType) => {
  const repo: IRepository<Events | Exams> =
    env.nodeConfig.type === "event" ? getCustomRepository(EventRepo) : getCustomRepository(ExamRepo);
  const logger = new Logger("slack");
  const web = new WebClient(env.slackConfig.token);
  const channelName = env.slackConfig.channel;

  web.chat
    .postMessage({
      username: "42Alert",
      channel: channelName,
      text: content(event),
    })
    .then(() => {
      logger.latency(200, new Date().getTime());
    })
    .catch(() => {
      repo.deleteOne(event.id);
    });
};

class SlackTextBuilder {
  color: string;
  pretext: string;
  fields: Array<slackTypes.Field>;
  blocks: Array<slackTypes.Block>;

  constructor({ color, pretext }: Partial<{ color: string; pretext: string }>) {
    this.color = color || "#2eb886";
    this.pretext = pretext || "";
    this.fields = [];
    this.blocks = [];
  }

  addField(field: slackTypes.Field) {
    if (field.short === undefined) {
      field.short = true;
    }
    this.fields.push(field);
    return this;
  }

  addBlock(block: any) {
    this.blocks.push(block);
    return this;
  }

  toJSON() {
    return {
      as_user: false,
      attachments: [
        {
          color: env.nodeConfig.environ === "production" ? "#FF0000" : this.color,
          pretext: this.pretext,
          fields: this.fields,
        },
      ],
      blocks: this.blocks,
    };
  }
}

type IError = {
  statusCode: number;
  stack: string;
  message: string;
};

const errorFormat = ({ statusCode, stack, message }: IError) => {
  const builder = new SlackTextBuilder({});
  builder
    .addField({
      title: "APP_NAME",
      value: `\`Agenda notifier\``,
    })
    .addField({
      title: "ENV_TYPE",
      value: `\`${env.nodeConfig.type}\``,
    })
    .addField({
      title: "TIME_STAMP",
      value: `\`${datetime(new Date())}\``,
    })
    .addField({
      title: "STATUS_CODE",
      value: `\`${statusCode}\``,
    })
    .addBlock({
      type: "header",
      text: {
        type: "plain_text",
        text: message,
        emoji: true,
      },
    })
    .addBlock({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `\`\`\`${stack}\`\`\``,
      },
    });
  return builder.toJSON();
};

export const slackError = async (error: IError) => {
  const body = errorFormat(error);
  await axios.post(env.slackConfig.errorUri, body);
};

export default slack;
