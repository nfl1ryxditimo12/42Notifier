import env from "./src/modules/env";

const { username, password, database, host, port } = env.dbConfig;

export default {
    type: "mysql",
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
    charset: "utf8mb4_general_ci",
    timezone: "+09:00",
    synchronize: true,
    logging: ["error"],
    logger: "file",
    maxQueryExecutionTime: 10000,
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
    cli: {
        entitiesDir: "src/entities",
        migrationsDir: "src/migrations",
        subscribersDir: "src/subscribers",
    },
};
