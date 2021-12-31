const axios = require("axios");

const getEvent = require("./getEvent");
const sendAlert = require("./sendAlert");

const checkData = async (value, flag) => {
    const newEventValue = await getEvent(value, flag);

    if (newEventValue.length > 0) newEventValue.map((event) => sendAlert(event, flag));
};

module.exports = (token) => {
    axios({
        method: "get",
        url: "https://api.intra.42.fr/v2/campus/29/events",
        headers: { Authorization: `Bearer ${token.eventToken}` },
    })
        .then(async (value) => await checkData(value.data, "event"))
        .catch((err) => {
            console.log(err);
            console.log("\x1b[31m[Event] - 42 API 호출에 실패하였습니다.\x1b[m");
        });

    axios({
        method: "get",
        url: "https://api.intra.42.fr/v2/campus/29/exams",
        headers: { Authorization: `Bearer ${token.examToken}` },
    })
        .then(async (value) => await checkData(value.data, "exam"))
        .catch((err) => {
            console.log(err);
            console.log("\x1b[31m[Exam] - 42 API 호출에 실패하였습니다.\x1b[m");
        });
};
