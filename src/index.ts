import "dotenv/config";
import { options, pipeline } from "./pipeline";
import { Server } from "socket.io";

const app = require("express")();
const server = require("http").createServer(app);
import get_env_vars, { ENV_VARS } from "./utils/get_env_vars";
import connect_to_db from "./utils/connect_to_db";
import change_event from "./change_event";
import * as events from "./utils/events";
import { Collection } from "mongodb";
import { TimesheetResponseProps } from "Timesheet";

const env_vars = get_env_vars(ENV_VARS);
(async () => {
  const io = new Server(server, {
    cors: {
      origin: env_vars.AUTOLOG_URL,
      methods: ["GET", "POST"],
    },
  });

  let ioServerConnect = (): Promise<Server> => {
    return new Promise((resolve, reject) => {
      io.on("connect", (socket) => {
        socket.on("disconnect", () => {
          // clean up code goes here
        });

        events.Check(socket);
        events.JoinRoom(socket);
        events.LeaveRoom(socket);
      });

      resolve(io);
    });
  };

  let watchChangeStreams = (
    mongoCollection: Collection<TimesheetResponseProps>,
    server: Server
  ) => {
    const changeStream = mongoCollection.watch(pipeline, options);
    const updateOnChange = change_event(server);
    changeStream.on("change", updateOnChange);
  };

  try {
    const { mongoCollection } = await connect_to_db(env_vars);
    const socketIoServer = await ioServerConnect();
    watchChangeStreams(mongoCollection, socketIoServer);
    server.listen(8080, () => {
      console.log("Listening on port 8080");
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
