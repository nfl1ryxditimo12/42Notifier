const Sequelize = require("sequelize");
if (process.env.SERVER_ENV === "development") require("dotenv").config();

const Event = require("./event");
const Exam = require("./exam");

const env = process.env.NODE_ENV || process.env.SERVER_ENV;
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

Event.init(sequelize);
Exam.init(sequelize);

module.exports = db;
