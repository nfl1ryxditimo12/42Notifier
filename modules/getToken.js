const axios = require("axios");
if (process.env.SERVER_ENV === "development") require("dotenv").config();

const Token = require("../models/token");

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

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Token.findOne({ where: { id: 1 } });
            const accessToken = token !== null ? token.dataValues : null;
            const retToken = {
                eventToken: token !== null ? accessToken.eventToken : undefined,
                examToken: token !== null ? accessToken.examToken : undefined,
            };
            if (accessToken === null) {
                const value = await tokenApi();

                await Token.create({
                    id: 1,
                    eventToken: value.event.access_token,
                    eventCreatedAt: value.event.created_at,
                    eventExpiresIn: value.event.expires_in,
                    examToken: value.exam.access_token,
                    examCreatedAt: value.exam.created_at,
                    examExpiresIn: value.exam.expires_in,
                }).catch((err) => {
                    throw err;
                });

                retToken.eventToken = value.event.access_token;
                retToken.examToken = value.event.access_token;
                console.log("\x1b[31m[Token] - 42API 토큰 발행에 성공하였습니다.\x1b[m");
            } else {
                const leftToken =
                    (accessToken.eventCreatedAt + 7200) * 1000 - Date.parse(new Date());

                if (leftToken <= 600000) {
                    const value = await tokenApi();

                    await Token.update(
                        {
                            eventToken: value.event.access_token,
                            eventCreatedAt: value.event.created_at,
                            eventExpiresIn: value.event.expires_in,
                            examToken: value.exam.access_token,
                            examCreatedAt: value.exam.created_at,
                            examExpiresIn: value.exam.expires_in,
                        },
                        { where: { id: 1 } }
                    ).catch((err) => {
                        throw err;
                    });

                    retToken.eventToken = value.event.access_token;
                    retToken.examToken = value.event.access_token;
                    console.log("\x1b[31m[Token] - 42API 토큰 발행에 성공하였습니다.\x1b[m");
                }
            }
            resolve(retToken);
        } catch (err) {
            reject(err + "\n\x1b[31m[Token] - 42 API 토큰 발행에 실패하였습니다.\x1b[m");
        }
    });
};
