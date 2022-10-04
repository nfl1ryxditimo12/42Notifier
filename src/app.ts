import express from "express";
import path from "path";

import env from "@modules/env";
import apiToken from "@modules/token";
import controller from "@controller/index";
import dbLoader from "@modules/orm.config";
import { dependencyInject } from "@modules/di";
import ErrorFilter from "@modules/error.filter";

const app = express();
const port = env.nodeConfig.port;

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
  console.log(`======= ENV: ${env.nodeConfig.environ} =======`);
  console.log(`🚀 App listening on the port ${port}`);

  await dbLoader()
    .then(() => {
      dependencyInject();
      setInterval(async () => {
        Promise.resolve(apiToken())
          .then(() => Promise.resolve(controller()).catch((err) => ErrorFilter(err)))
          .catch((err) => ErrorFilter(err));
      }, 3000);
    })
    .catch((err) => console.log(err));
});
