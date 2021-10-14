const express = require("express");
const path = require("path");
const axios = require("axios");
const http = require("http");
const cron = require("node-cron");
const { WebClient } = require("@slack/web-api");
const { sequelize } = require("./models");

const getToken = require("./util/token");
const getText = require("./util/text");
const getSubscribe = require("./util/crawling");

const PORT = process.env.PORT || 5000;
const app = express();

const Event = require("./models/event");
const web = new WebClient(process.env.SLACK_TOKEN);
const webTest = new WebClient(process.env.TEST_TOKEN);
const channelName = "#agenda-alert";
const access = {
    token: undefined,
    createdAt: undefined,
    expiresIn: undefined,
};

/*
    노드 크론으로 헤로쿠 서버를 잠들지 않게 20분 간격으로 깨워준다.
    헤로쿠 서버가 US 리전이여서 23시 - 14시 까지 돌려준다. (GMT 기준 08시 - 23시)
*/

cron.schedule("*/20 23,0-14 * * *", () => {
    console.log("node-cron");
    http.get("http://ftalert.herokuapp.com/");
});

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("index"));

/*
    42 API 토큰 발급 -> 이벤트 조회 -> 데이터 가공 -> 슬랙 출력

    최신 이벤트를 어떤식으로 알아내나?
    - 제일 최근 이벤트의 id값을 DB에서 최신 id와 비교해서 알아낸다
    - 서버가 꺼지거나 재시작 되어도 최신 이벤트 id값은 유지된다.

    실행을 3초 변경 -> 못잡는 이벤트 설정
*/

setInterval(async () => {
    await getToken(access)
        .then(async (retValue) => {
            access.token = retValue.token;
            access.createdAt = retValue.createdAt;
            access.expiresIn = retValue.expiresIn;

            await axios({
                method: "get",
                url: "https://api.intra.42.fr/v2/campus/29/events",
                headers: { Authorization: `Bearer ${access.token}` },
            })
                .then(async (value) => {
                    const eventApi = value.data;
                    eventApi.sort((a, b) => b.id - a.id);
                    const nowEvent = await Event.findAll({});
                    nowEvent.sort((a, b) => b.dataValues.id - a.dataValues.id);
                    const newEvent = eventApi.filter((event) =>
                        nowEvent.length > 0 ? event.id > nowEvent[0].id : event
                    );

                    if (newEvent.length > 0) {
                        newEvent.map(async (event) => {
                            getSubscribe(event.id);
                            webTest.chat
                                .postMessage({
                                    username: "42Alert",
                                    channel: channelName,
                                    text: getText(event),
                                })
                                .then((res) => {
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
                                        max_people:
                                            event.max_people !== null ? event.max_people : null,
                                        begin_at: event.begin_at,
                                        end_at: event.end_at,
                                        themes: theme !== null ? theme.join(", ") : null,
                                    }).catch((err) =>
                                        console.log(
                                            `\x1b[31m[DB] - ${event.id} 데이터베이스 저장 실패\x1b[0m`
                                        )
                                    );

                                    console.log(`\x1b[31m[Slack] - ${event.name}\x1b[0m`);
                                })
                                .catch((err) => {
                                    console.log(err);
                                    console.log(
                                        `\x1b[31m[Slack] - ${event.id} 이벤트 등록 실패\x1b[0m`
                                    );
                                });
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    console.log("\x1b[31m[Event] - 42 API 호출에 실패하였습니다.\x1b[m");
                });
        })
        .catch((err) => console.log(err));
}, 3000);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
