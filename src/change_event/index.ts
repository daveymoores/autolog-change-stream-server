import * as socketIo from "socket.io";

import { TimesheetResponseProps } from "Timesheet";

export interface ChangeEventNext {
  documentKey: string | null;
  fullDocument: TimesheetResponseProps | null;
  updateDescription: { updatedFields: TimesheetResponseProps };
}

const change_event = (io: socketIo.Server) => (next: ChangeEventNext) => {
  // at the very least there should be document ID
  if (!next.documentKey) {
    throw new Error("No data returned");
  }

  const modified_timesheet = next?.fullDocument?.random_path;
  const updateFields = next?.updateDescription?.updatedFields;

  // if fields haven't been updated then prevent this from firing
  if (!updateFields) {
    return;
  }

  if (!modified_timesheet) {
    throw new Error("Couldn't find the modified timesheet from change stream");
  }

  console.log("Mongodb change event for timesheet: ", modified_timesheet);

  const signee = Object.keys(updateFields).find(
    (key: string) => key.indexOf("_signature") > -1
  ) as "user_signature" | "approver_signature";

  const payload = {
    signature: signee ? updateFields[signee] : null,
    signee,
    error: false,
  };

  io.to(modified_timesheet).emit("signature_update", payload);
};

export default change_event;
