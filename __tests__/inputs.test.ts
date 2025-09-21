import { getServerUrl } from "../src/inputs";

describe("getServerUrl", () => {
  it("should return the github.com", () => {
    const url = getServerUrl();
    expect(url.host).toBe("github.com");
  });

  it("should return the enterprise server", () => {
    process.env["GITHUB_SERVER_URL"] = "https://github.example.com";
    const url = getServerUrl();
    expect(url.host).toBe("github.example.com");
  });
});
