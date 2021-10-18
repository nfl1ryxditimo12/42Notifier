if (process.env.SERVER_ENV === "development") require("dotenv").config();

module.exports = {
    development: {
        username: "root",
        password: null,
        database: "42Alert",
        host: "127.0.0.1",
        dialect: "mysql",
        logging: false,
    },
    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: "mysql",
    },
    production: {
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST,
        dialect: "mysql",
        logging: false,
    },
};
