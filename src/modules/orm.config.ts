import { createConnection, ConnectionOptions, getConnection } from "typeorm";
import env from "@modules/env";
import { Events } from "@entities/events";
import { Exams } from "@entities/exams";

const { host, port, username, password, database } = env.dbConfig;

const defaultOrmConfig: ConnectionOptions = {
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
  maxQueryExecutionTime: 2000,
  entities: [Events, Exams],
};

const dbLoader = async (ormConfig: ConnectionOptions = defaultOrmConfig) =>
  await createConnection(ormConfig).then(() => console.log("🚀 DB Connected"));

export const clearDatabase = () => getConnection().close();

export default dbLoader;
