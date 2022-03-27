import "dotenv/config";
import { options, pipeline } from "./pipeline";
import { Server } from "socket.io";

const app = require("express")();
const http = require("http").Server(app);
import get_env_vars, { ENV_VARS } from "./utils/get_env_vars";
import connect_to_db from "./utils/connect_to_db";
import change_event from "./change_event";

const env_vars = get_env_vars(ENV_VARS);

async function main() {
  const io = new Server(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  const { client, mongoCollection } = await connect_to_db(env_vars);

  const changeStream = mongoCollection.watch(pipeline, options);
  const updateOnChange = change_event(io);

  io.on("connection", (socket) => {
    console.log("connection established");
    changeStream.on("change", updateOnChange);
  });

  http.listen(8080);
}

main().catch(console.error);
