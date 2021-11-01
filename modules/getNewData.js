const Event = require("../models/event");
const Exam = require("../models/exam");

module.exports = async (data, flag) => {
    const eventApi = data;
    eventApi.sort((a, b) => b.id - a.id);
    const nowEvent = flag === "event" ? await Event.findAll({}) : await Exam.findAll({});
    nowEvent.sort((a, b) => b.dataValues.id - a.dataValues.id);

    if (flag === "event") {
        return eventApi.filter((event) => event.id > nowEvent[0].dataValues.id);
    } else {
        return eventApi.filter((event) => {
            if (
                event.cursus[0].slug === "42cursus" &&
                event.name.indexOf("test") === -1 &&
                event.location.indexOf("test") === -1
            )
                return event.id > nowEvent[0].dataValues.id;
        });
    }
};
