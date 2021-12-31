const axios = require("axios");
if (process.env.SERVER_ENV === "development") require("dotenv").config();

/*
    42 API 토큰 생성

    현재 토큰이 없다! - 새로운 토큰 생성

    현재 토큰이 있다! - 현재 토큰의 만료시간이 200초 이내일 경우 - 새로운 토큰 생성
                  ㄴ 200초 이외일 경우 - 토큰의 잔여시간 출력

    그외 - 오류 출력
*/

const tokenApi = async () => {
    const eventToken = await axios({
        method: "post",
        url: process.env.FT_TOKEN_URL,
        params: {
            grant_type: "client_credentials",
            client_id: process.env.FT_EVENT_UID,
            client_secret: process.env.FT_EVENT_SECRET,
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

    return {
        event: eventToken.data,
        exam: examToken.data,
    };
};

module.exports = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const retToken = {
                eventToken: token.eventToken !== undefined ? token.eventToken : undefined,
                eventCreatedAt: token.eventCreatedAt !== undefined ? token.eventCreatedAt : undefined,
                examToken: token.examToken !== undefined ? token.examToken : undefined,
                examCreatedAt: token.examCreatedAt !== undefined ? token.examCreatedAt : undefined,
            };
            const leftToken =
                retToken.eventCreatedAt !== undefined && retToken.examCreatedAt !== undefined
                    ? (retToken.eventCreatedAt > retToken.examCreatedAt
                          ? retToken.examCreatedAt
                          : retToken.eventCreatedAt + 7200) *
                          1000 -
                      Date.parse(new Date())
                    : undefined;

            if (leftToken === undefined) {
                const value = await tokenApi();

                retToken.eventToken = value.event.access_token;
                retToken.eventCreatedAt = value.event.created_at;
                retToken.examToken = value.exam.access_token;
                retToken.examCreatedAt = value.exam.created_at;
                console.log("\x1b[31m[Token] - 42API 새 토큰 발행에 성공하였습니다.\x1b[m");
            } else {
                if (leftToken <= 0) {
                    const value = await tokenApi();
                    console.log(leftToken);

                    retToken.eventToken = value.event.access_token;
                    retToken.eventCreatedAt = value.event.created_at;
                    retToken.examToken = value.exam.access_token;
                    retToken.examCreatedAt = value.exam.created_at;
                    console.log("\x1b[31m[Token] - 42API 토큰 업데이트에 성공하였습니다.\x1b[m");
                }
            }
            resolve(retToken);
        } catch (err) {
            reject(err + "\n\x1b[31m[Token] - 42 API 토큰 발행에 실패하였습니다.\x1b[m");
        }
    });
};
