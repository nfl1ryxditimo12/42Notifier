import express from "express";
import path from "path";

import env from "@modules/env";
import apiToken from "@modules/token.api";
import controller from "@controller/index";
import { tokenType } from "tokenType";
import dbLoader from "@modules/orm.config";

const app = express();
const port = env.port || 5000;

const token: tokenType = {
    eventToken: undefined,
    eventCreatedAt: undefined,
    examToken: undefined,
    examCreatedAt: undefined,
};

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("index"));

/*
42 API 토큰 발급 -> 이벤트 조회 -> 데이터 가공 -> 슬랙 출력
최신 이벤트를 어떤식으로 알아내나?
- 제일 최신 이벤트의 id값을 DB에 저장된 최신 id와 비교해서 알아낸다
- 서버가 꺼지거나 재시작 되어도 최신 이벤트 id값은 유지된다.
*/

app.listen(port, async () => {
    console.log(`======= ENV: ${env.nodeEnv} =======`);
    console.log(`🚀 App listening on the port ${port}`);

    await dbLoader().then(() => {
        setInterval(async () => {
            await apiToken(token)
                .then(() => {
                    controller(token);
                })
                .catch((err) => console.log(err));
        }, 3000);
    });
});
