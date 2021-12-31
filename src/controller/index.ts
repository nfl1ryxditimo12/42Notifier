import axios from "axios";
import { getCustomRepository } from "typeorm";

import newEvent from "@modules/new.event";
import slack from "@modules/slack";
import { EventRepo } from "@repository/event.repository";
import { ExamRepo } from "@repository/exam.repository";
import { tokenType } from "tokenType";

const checkData = async (value: Array<any>, flag: string) => {
    const newEventValue = await newEvent(value, flag);

    newEventValue.map((event) => {
        const eventRepo = getCustomRepository(EventRepo);
        const examRepo = getCustomRepository(ExamRepo);

        if (flag === "event") {
            eventRepo
                .createEvent(event)
                .then(() => slack(event, flag))
                .catch((err) => {
                    console.log(err);
                    console.log(`\x1b[31m[DB] - ${event.id} 데이터베이스 저장 실패\x1b[0m`);
                });
        } else {
            examRepo
                .createExam(event)
                .then(() => slack(event, flag))
                .catch((err) => {
                    console.log(err);
                    console.log(`\x1b[31m[DB] - ${event.id} 데이터베이스 저장 실패\x1b[0m`);
                });
        }
    });
};

const controller = (token: tokenType) => {
    axios({
        method: "get",
        url: "https://api.intra.42.fr/v2/campus/29/events",
        headers: { Authorization: `Bearer ${token.eventToken}` },
    })
        .then((value) => checkData(value.data, "event"))
        .catch((err) => {
            console.log(err);
            console.log("\x1b[31m[Event] - 42 API 호출에 실패하였습니다.\x1b[m");
        });

    axios({
        method: "get",
        url: "https://api.intra.42.fr/v2/campus/29/exams",
        headers: { Authorization: `Bearer ${token.examToken}` },
    })
        .then((value) => checkData(value.data, "exam"))
        .catch((err) => {
            console.log(err);
            console.log("\x1b[31m[Exam] - 42 API 호출에 실패하였습니다.\x1b[m");
        });
};

export default controller;
