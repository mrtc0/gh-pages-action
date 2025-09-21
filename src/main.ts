import * as core from "@actions/core";
import { getInputs } from "./inputs";
import { publish } from "./publish";

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const inputs = getInputs();
    await publish(inputs);

    core.info("Successfully published to GitHub Pages");
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("unexpected error");
    }
  }
}
