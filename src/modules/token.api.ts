import axios from "axios";
import env from "@modules/env";

import { tokenType } from "tokenType";
import { sendError } from "./slack";

/*
    42 API 토큰 생성
    현재 토큰이 없다! - 새로운 토큰 생성
    현재 토큰이 있다! - 현재 토큰의 만료시간이 200초 이내일 경우 - 새로운 토큰 생성
                  ㄴ 200초 이외일 경우 - 토큰의 잔여시간 출력
    그외 - 오류 출력
*/

const getToken = async () => {
  const eventToken = await axios({
    method: "post",
    url: env.ftConfig.apiUrl + "/oauth/token",
    params: {
      grant_type: "client_credentials",
      client_id: env.ftConfig.eventId,
      client_secret: env.ftConfig.eventSecret,
    },
  });

  const examToken = await axios({
    method: "post",
    url: env.ftConfig.apiUrl + "/oauth/token",
    params: {
      grant_type: "client_credentials",
      client_id: env.ftConfig.examId,
      client_secret: env.ftConfig.examSecret,
    },
  });

  return {
    event: eventToken.data,
    exam: examToken.data,
  };
};

const apiToken = (token: tokenType) => {
  return new Promise(async (resolve, reject) => {
    try {
      let leftToken =
        token.eventCreatedAt !== undefined && token.examCreatedAt !== undefined
          ? (token.eventCreatedAt > token.examCreatedAt ? token.examCreatedAt : token.eventCreatedAt + 7200) * 1000 -
            Date.parse(String(new Date()))
          : undefined;

      if (leftToken <= 0) leftToken = undefined;

      if (leftToken === undefined) {
        const value = await getToken();

        token.eventToken = value.event.access_token;
        token.eventCreatedAt = value.event.created_at;
        token.examToken = value.exam.access_token;
        token.examCreatedAt = value.exam.created_at;
        console.log("\x1b[31m[Token] - 42API 새 토큰 발행에 성공하였습니다.\x1b[m");
      }
      resolve("");
    } catch (err) {
      const error = "[Token] - 42 API 토큰 발행에 실패하였습니다.";
      console.log(err + "\n\x1b[31m" + error + "\x1b[m");

      sendError(error, err);
      reject(error);
    }
  });
};

export default apiToken;
