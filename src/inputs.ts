import * as core from "@actions/core";

export interface Inputs {
  readonly githubToken: string;
  readonly publishBranch: string;
  readonly publishDir: string;
  readonly cname: string;
}

export function getInputs(): Inputs {
  return {
    githubToken: core.getInput("github_token"),
    publishBranch: core.getInput("publish_branch"),
    publishDir: core.getInput("publish_dir"),
    cname: core.getInput("cname"),
  };
}

export function getServerUrl(): URL {
  return new URL(process.env["GITHUB_SERVER_URL"] || "https://github.com");
}
