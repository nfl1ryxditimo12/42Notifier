const Sequelize = require("sequelize");

const Event = require("./event");

const env = process.env.NODE_ENV || "production";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

Event.init(sequelize);

module.exports = db;
