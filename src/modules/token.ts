import env from "@modules/env";

import Http, { HttpRequest } from "./http";
import Get from "./di";

/*
    42 API 토큰 생성
    현재 토큰이 없다! - 새로운 토큰 생성
    현재 토큰이 있다! - 현재 토큰의 만료시간이 200초 이내일 경우 - 새로운 토큰 생성
                  ㄴ 200초 이외일 경우 - 토큰의 잔여시간 출력
    그외 - 오류 출력
*/

export class Token {
  token: string;
  createdAt: number;

  constructor() {
    this.token = undefined;
    this.createdAt = undefined;
  }
}

const tokenParam = new HttpRequest({
  method: "post",
  path: "/oauth/token",
  params: {
    grant_type: "client_credentials",
    client_id: env.ftConfig.uid,
    client_secret: env.ftConfig.secret,
  },
});

const apiToken = async () => {
  const token: Token = Get.get("Token");
  let leftToken = token.createdAt !== undefined ? (token.createdAt + 7200) * 1000 - Date.parse(String(new Date())) : undefined;

  if (!leftToken || leftToken <= 0) {
    const http: Http = Get.get("Http");
    const newToken = await http.connect(tokenParam);

    token.token = newToken["access_token"];
    token.createdAt = newToken["created_at"];

    console.log("\x1b[31m[Token] - 42API 새 토큰 발행에 성공하였습니다.\x1b[m");
  }
};

export default apiToken;
