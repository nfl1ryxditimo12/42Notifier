const Event = require("../models/event");
const Exam = require("../models/exam");

const newEvent = async (data) => {
    const eventApi = data;
    eventApi.sort((a, b) => b.id - a.id);
    const nowEvent = await Event.findAll({});
    nowEvent.sort((a, b) => b.dataValues.id - a.dataValues.id);

    return eventApi.filter((event) => event.id > nowEvent[0].dataValues.id);
};

const newExam = async (data) => {
    const eventApi = data;
    eventApi.sort((a, b) => b.id - a.id);
    const nowEvent = await Exam.findAll({});
    nowEvent.sort((a, b) => b.dataValues.id - a.dataValues.id);

    return eventApi.filter((event) => {
        if (
            event.cursus[0].slug === "42cursus" &&
            event.name.indexOf("test") === -1 &&
            event.location.indexOf("test") === -1
        )
            return event.id > nowEvent[0].dataValues.id;
    });
};

module.exports = { newEvent, newExam };
