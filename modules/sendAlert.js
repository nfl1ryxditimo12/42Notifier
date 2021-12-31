const { WebClient } = require("@slack/web-api");
if (process.env.SERVER_ENV === "development") require("dotenv").config();

const web = new WebClient(process.env.SLACK_TOKEN);
const channelName = process.env.SLACK_CHANNEL;

const Event = require("../models/event");
const Exam = require("../models/exam");

const getText = require("./formatText");

const sendMessage = (event, eventFlag) => {
    web.chat
        .postMessage({
            username: "42Alert",
            channel: channelName,
            text: getText(event, eventFlag),
        })
        .then(() =>
            console.log(
                eventFlag === "event"
                    ? `\x1b[31m[Slack || Event] - ${event.name}\x1b[0m`
                    : `\x1b[31m[Slack || Exam] - ${event.name}\x1b[0m`
            )
        )
        .catch((err) => {
            eventFlag === "event" ? Event.delete({ where: { id: event.id } }) : Exam.delete({ where: { id: event.id } });
            console.log(err);
            console.log(`\x1b[31m[Slack] - ${event.id} 이벤트 등록 실패\x1b[0m`);
        });
};

module.exports = (event, eventFlag) => {
    if (eventFlag === "event") {
        const theme =
            event.themes.length > 0
                ? event.themes.map((value) => {
                      return "# " + value.name;
                  })
                : null;

        Event.create({
            id: event.id,
            name: event.name,
            description: event.description,
            location: event.location.length > 0 ? event.location : null,
            max_people: event.max_people !== null ? event.max_people : null,
            begin_at: event.begin_at,
            end_at: event.end_at,
            created_at: event.created_at,
            themes: theme !== null ? theme.join(", ") : null,
        })
            .then(() => sendMessage(event, eventFlag))
            .catch((err) => {
                console.log(err);
                console.log(`\x1b[31m[DB] - ${event.id} 데이터베이스 저장 실패\x1b[0m`);
            });
    } else {
        Exam.create({
            id: event.id,
            name: event.name,
            location: event.location.length > 0 ? event.location : null,
            max_people: event.max_people !== null ? event.max_people : null,
            begin_at: event.begin_at,
            end_at: event.end_at,
            created_at: event.created_at,
        })
            .then(() => sendMessage(event, eventFlag))
            .catch((err) => {
                console.log(err);
                console.log(`\x1b[31m[DB] - ${event.id} 데이터베이스 저장 실패\x1b[0m`);
            });
    }
};
