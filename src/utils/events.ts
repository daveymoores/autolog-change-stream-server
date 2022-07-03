import { Socket } from "socket.io";

export const Check = (socket: Socket) => {
  socket.on("Check", (data: any) => {
    socket.emit("Check", data);
  });
};

/*
  eventName: JoinRoom
  data: [ROOM_UUID, ...]
*/
export const JoinRoom = (socket: Socket) => {
  socket.on("JoinRoom", (data: any) => {
    console.info("joining: " + data);
    socket.join(data);
  });
};

/*
  eventName: LeaveRoom
  data: [ROOM_UUID, ...]
*/
export const LeaveRoom = (socket: Socket) => {
  socket.on("LeaveRoom", (data: any) => {
    console.info("leaving: " + data);
    for (let uuid of data) {
      socket.leave(uuid);
    }
  });
};
