const Event = require("../models/event");
const Exam = require("../models/exam");

const examCursusValid = (event) => {
    return event.cursus[0].slug === "42cursus" && event.name.indexOf("test") === -1 && event.location.indexOf("test") === -1;
};

const isNewEvent = (eventApi, nowEvent, flag) => {
    return eventApi.filter((event) => (flag !== "event" ? examCursusValid(event) : 1) && event.id > nowEvent[0].dataValues.id);
};

module.exports = async (data, flag) => {
    const eventApi = data;
    eventApi.sort((a, b) => b.id - a.id);
    const nowEvent = flag === "event" ? await Event.findAll({}) : await Exam.findAll({});
    nowEvent.sort((a, b) => b.dataValues.id - a.dataValues.id);
    const event = isNewEvent(eventApi, nowEvent, flag);

    return event;
};
