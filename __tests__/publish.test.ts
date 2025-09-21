import fs from "fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { copyPublishDir } from "../src/publish";

describe("copyPublishDir", () => {
  it("should copy files from source to destination", async () => {
    const src = fs.mkdtempSync(join(tmpdir(), "src-"));
    const dest = fs.mkdtempSync(join(tmpdir(), "dest-"));

    fs.writeFileSync(join(src, "test.txt"), "This is a test file.");
    fs.mkdirSync(join(src, "subdir"));
    fs.writeFileSync(
      join(src, "subdir", "nested.txt"),
      "This is a nested test file."
    );

    await copyPublishDir(src, dest);

    expect(fs.existsSync(join(dest, "test.txt"))).toBe(true);
    expect(fs.readFileSync(join(dest, "test.txt"), "utf-8")).toBe(
      "This is a test file."
    );
    expect(fs.existsSync(join(dest, "subdir", "nested.txt"))).toBe(true);
    expect(fs.readFileSync(join(dest, "subdir", "nested.txt"), "utf-8")).toBe(
      "This is a nested test file."
    );
  });
});
