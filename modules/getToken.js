const axios = require("axios");
if (process.env.SERVER_ENV === "development") require("dotenv").config();

/*
    42 API 토큰 생성

    현재 토큰이 없다! - 새로운 토큰 생성

    현재 토큰이 있다! - 현재 토큰의 만료시간이 200초 이내일 경우 - 새로운 토큰 생성
                  ㄴ 200초 이외일 경우 - 토큰의 잔여시간 출력

    그외 - 오류 출력
*/

module.exports = (accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const leftToken =
                (accessToken.event.createdAt + accessToken.event.expiresIn) * 1000 -
                Date.parse(new Date());

            if (
                accessToken.event.token === undefined ||
                accessToken.exam.token === undefined ||
                leftToken <= 600000
            ) {
                const eventToken = await axios({
                    method: "post",
                    url: process.env.FT_TOKEN_URL,
                    params: {
                        grant_type: "client_credentials",
                        client_id: process.env.FT_API_UID,
                        client_secret: process.env.FT_API_SECRET,
                    },
                });

                const examToken = await axios({
                    method: "post",
                    url: process.env.FT_TOKEN_URL,
                    params: {
                        grant_type: "client_credentials",
                        client_id: process.env.FT_EXAM_UID,
                        client_secret: process.env.FT_EXAM_SECRET,
                    },
                });

                console.log("\x1b[31m[Token] - 42API 토큰 발행에 성공하였습니다.\x1b[m");

                accessToken.event.token = eventToken.data.access_token;
                accessToken.event.createdAt = eventToken.data.created_at;
                accessToken.event.expiresIn = eventToken.data.expires_in;

                accessToken.exam.token = examToken.data.access_token;
                accessToken.exam.createdAt = examToken.data.created_at;
                accessToken.exam.expiresIn = examToken.data.expires_in;

                resolve(accessToken);
            } else {
                console.log(
                    `토큰 소멸까지 \x1b[31m${
                        leftToken / 1000 / 60 / 60 >= 1
                            ? `${parseInt(leftToken / 1000 / 60 / 60) % 60}시간 `
                            : ""
                    }${parseInt(leftToken / 1000 / 60) % 60}분 ${
                        parseInt(leftToken / 1000) % 60
                    }초\x1b[0m 남았습니다.`
                );
                resolve(accessToken);
            }
        } catch (err) {
            reject("\x1b[31m[Token] - 42 API 토큰 발행에 실패하였습니다.\x1b[m");
        }
    });
};
