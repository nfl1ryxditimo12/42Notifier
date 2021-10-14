const axios = require("axios");

/*
    42 API 토큰 생성

    현재 토큰이 없다! - 새로운 토큰 생성

    현재 토큰이 있다! - 현재 토큰의 만료시간이 200초 이내일 경우 - 새로운 토큰 생성
                  ㄴ 200초 이외일 경우 - 토큰의 잔여시간 출력

    그외 - 오류 출력
*/

module.exports = (origin) => {
    return new Promise(async (resolve, reject) => {
        try {
            const retValue = {
                token: origin.token,
                createdAt: origin.createdAt,
                expiresIn: origin.expiresIn,
            };
            const leftToken =
                (retValue.createdAt + retValue.expiresIn) * 1000 - Date.parse(new Date());

            if (retValue.token === undefined || leftToken <= 600000) {
                const newToken = await axios({
                    method: "post",
                    url: process.env.FT_TOKEN_URL,
                    params: {
                        grant_type: "client_credentials",
                        client_id: process.env.FT_API_UID,
                        client_secret: process.env.FT_API_SECRET,
                    },
                });

                console.log("\x1b[31m[Token] - 42API 토큰 발행에 성공하였습니다.\x1b[m");

                retValue.token = newToken.data.access_token;
                retValue.createdAt = newToken.data.created_at;
                retValue.expiresIn = newToken.data.expires_in;

                resolve(retValue);
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
                resolve(retValue);
            }
        } catch (err) {
            reject("\x1b[31m[Token] - 42 API 토큰 발행에 실패하였습니다.\x1b[m");
        }
    });
};
