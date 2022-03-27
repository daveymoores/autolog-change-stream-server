import get_env_vars, { ENV_VARS } from "../get_env_vars";

describe("get_connection_vars", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("gets env vars without error", () => {
    process.env.MONGODB_URI = "these";
    process.env.MONGODB_DB = "are";
    process.env.MONGODB_COLLECTION = "env";
    process.env.SITE_URL = "vars";

    expect(get_env_vars(ENV_VARS)).toEqual({
      MONGODB_URI: "these",
      MONGODB_DB: "are",
      MONGODB_COLLECTION: "env",
      SITE_URL: "vars",
    });
  });

  it("throws an error if an env var isn't set", () => {
    expect(() => get_env_vars(ENV_VARS)).toThrow();
  });
});
