import path from "path";

const { NODE_TYPE } = process.env;

if (NODE_TYPE === "event") {
  require("dotenv").config({ path: path.join(process.env.PWD, "/.env.event") });
} else if (NODE_TYPE === "exam") {
  require("dotenv").config({ path: path.join(process.env.PWD, "/.env.exam") });
} else {
  throw new Error("process.env.NODE_TYPE을 설정하지 않았습니다.");
}

const env = {
  nodeConfig: {
    environ: process.env.NODE_ENV,
    port: parseInt(String(process.env.PORT), 10) || (NODE_TYPE === "event" ? 5000 : 5001),
    type: process.env.TYPE,
  },
  ftConfig: {
    uid: process.env.FT_API_UID,
    secret: process.env.FT_API_SECRET,
    url: process.env.FT_API_URL,
    path: process.env.FT_API_PATH,
  },
  slackConfig: {
    token: process.env.SLACK_TOKEN,
    channel: process.env.SLACK_CHANNEL,
    errorUri: process.env.SLACK_ERROR_URI,
  },
  dbConfig: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: parseInt(String(process.env.DATABASE_PORT), 10),
  },
};

export default env;
