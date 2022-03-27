import connect_to_db from "../connect_to_db";
jest.mock("mongodb", () => ({
  MongoClient: jest.fn(() => ({
    connect: jest.fn(),
    db: jest.fn(() => ({
      collection: jest.fn(),
    })),
  })),
}));

describe("connect_to_db", () => {
  it("connects and returns a connection object", async () => {
    const connection_vars = {
      MONGODB_URI: "test",
      MONGODB_DB: "test",
      MONGODB_COLLECTION: "test",
    };
    const obj = await connect_to_db(connection_vars);
    expect(obj).toMatchInlineSnapshot(`
      Object {
        "client": Object {
          "connect": [MockFunction] {
            "calls": Array [
              Array [],
            ],
            "results": Array [
              Object {
                "type": "return",
                "value": undefined,
              },
            ],
          },
          "db": [MockFunction] {
            "calls": Array [
              Array [
                "test",
              ],
            ],
            "results": Array [
              Object {
                "type": "return",
                "value": Object {
                  "collection": [MockFunction] {
                    "calls": Array [
                      Array [
                        "test",
                      ],
                    ],
                    "results": Array [
                      Object {
                        "type": "return",
                        "value": undefined,
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        "database": Object {
          "collection": [MockFunction] {
            "calls": Array [
              Array [
                "test",
              ],
            ],
            "results": Array [
              Object {
                "type": "return",
                "value": undefined,
              },
            ],
          },
        },
        "mongoCollection": undefined,
      }
    `);
  });
});
