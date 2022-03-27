import * as socketIo from "socket.io";

import { TimesheetResponseProps } from "../../types/Timesheet.types";
import change_event, { ChangeEventNext } from "./index";

describe("mongodb change event", () => {
  class MockIo {
    to = jest.fn(() => this);
    emit = jest.fn(() => this);
  }

  const mockNext: ChangeEventNext = {
    documentKey: "123",
    fullDocument: {
      random_path: "456",
    } as TimesheetResponseProps,
    updateDescription: {
      updatedFields: {
        user_signature: "Hello",
      } as TimesheetResponseProps,
    },
  };

  it("curries the socket server and emits a payload", () => {
    const mockIo = new MockIo();
    const event_callback = change_event(mockIo as unknown as socketIo.Server);
    event_callback(mockNext);
    expect(mockIo.to).toBeCalledWith("456");
    expect(mockIo.emit).toBeCalledWith("signature_update", {
      signature: "Hello",
      signee: "user_signature",
      error: false,
    });
  });

  it("throws an error if a timesheet isn't returned", () => {
    const mockIo = new MockIo();
    const mockTimesheetWithNullDocument = {
      ...mockNext,
      fullDocument: null,
    };
    const event_callback = change_event(mockIo as unknown as socketIo.Server);
    expect(() => event_callback(mockTimesheetWithNullDocument)).toThrowError(
      "Couldn't find the modified timesheet from change stream"
    );
  });

  it("throws an error if no document key is returned", () => {
    const mockIo = new MockIo();
    const mockTimesheetWithNullDocument = {
      ...mockNext,
      documentKey: null,
    };
    const event_callback = change_event(mockIo as unknown as socketIo.Server);
    expect(() => event_callback(mockTimesheetWithNullDocument)).toThrowError(
      "No data returned"
    );
  });
});
