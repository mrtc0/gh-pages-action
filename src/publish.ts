import * as path from "path";
import * as github from "@actions/github";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import fs from "fs";
import { getServerUrl, Inputs } from "./inputs";

export async function publish(inputs: Inputs): Promise<void> {
  const workingDir = await createWorkingRepo(inputs);

  await createCNAME(inputs.cname, workingDir);

  await exec.exec("git", ["remote", "rm", "origin"]);
  await exec.exec("git", [
    "remote",
    "add",
    "origin",
    getRemoteURL(inputs.githubToken),
  ]);
  await exec.exec("git", ["add", "--all"]);
  await exec.exec("git", [
    "config",
    "user.name",
    `${process.env["GITHUB_ACTOR"]}`,
  ]);
  await exec.exec("git", [
    "config",
    "user.email",
    `${process.env["GITHUB_ACTOR"]}@users.noreply.github.com`,
  ]);

  const commitMessage = `Deploy to GitHub Pages ${github.context.sha}`;
  await exec.exec("git", ["commit", "-m", `${commitMessage}`]);
  await exec.exec("git", ["push", "origin", `HEAD:${inputs.publishBranch}`]);
}

export function getRemoteURL(token: string): string {
  const repo = github.context.repo;
  const host = getServerUrl().host;

  return `https://x-access-token:${token}@${host}/${repo.owner}/${repo.repo}.git`;
}

export async function createWorkingRepo(inputs: Inputs): Promise<string> {
  const tmpDir = path.join(
    `${process.env["RUNNER_TEMP"]}`,
    `gh-pages-${Math.random().toString(36).substring(2, 15)}`
  );

  await io.mkdirP(tmpDir);

  const publishDir = path.join(
    `${process.env["GITHUB_WORKSPACE"]}`,
    inputs.publishDir
  );

  const remoteURL = getRemoteURL(inputs.githubToken);

  try {
    const exitCode = await exec.exec("git", [
      "clone",
      "--branch",
      inputs.publishBranch,
      "--single-branch",
      "--depth",
      "1",
      remoteURL,
      tmpDir,
    ]);

    if (exitCode !== 0) {
      throw new Error(`Failed to clone repository: ${exitCode}`);
    }

    process.chdir(tmpDir);

    io.cp(`${publishDir}/*`, tmpDir, { recursive: true, force: true });
  } catch (error) {
    throw new Error(`Failed to clone repository: ${error}`);
  }

  return tmpDir;
}

async function createCNAME(cname: string, dir: string): Promise<void> {
  if (cname) {
    await fs.promises.writeFile(path.join(dir, "CNAME"), cname);
  }
}

export async function copyPublishDir(src: string, dest: string): Promise<void> {
  await io.cp(src, dest, {
    recursive: true,
    force: true,
    copySourceDirectory: false,
  });
}
