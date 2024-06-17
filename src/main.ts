import * as core from '@actions/core';
import { env } from 'node:process';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';

async function checkAlreadyInstalled(): Promise<boolean> {
  try {
    await io.which('git-metrics', true);
    return true;
  } catch {
    return false;
  }
}

function getFilenameFromPlatform(): string | undefined {
  if (process.platform === 'linux' || process.platform === 'darwin') {
    if (process.arch === 'x64') {
      return `git-metrics_${process.platform}-x86_64`;
    }
    if (process.arch === 'arm64') {
      return `git-metrics_${process.platform}-aarch64`;
    }
    core.setFailed(
      `The architecture ${process.arch} is not supported for the platform ${process.platform}`,
    );
  } else {
    core.setFailed(`The platform ${process.platform} is not supported`);
  }
  return undefined;
}

async function download(filename: string, version: string): Promise<void> {
  core.debug('creating bin directory and adding to path');
  await io.mkdirP(`${env.HOME}/.local/bin`);
  core.addPath(`${env.HOME}/.local/bin`);

  core.info(`downloading ${filename} ${version}`);
  const gitMetricsPath = await tc.downloadTool(
    `https://github.com/jdrouet/git-metrics/releases/download/${version}/${filename}`,
  );
  await io.mv(gitMetricsPath, `${env.HOME}/.local/bin`);
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    if (await checkAlreadyInstalled()) {
      core.info('git-metrics already installed');
      core.setOutput('already-installed', 'true');
      return;
    }
    core.setOutput('already-installed', 'false');

    const filename = getFilenameFromPlatform();
    if (!filename) return;

    const version = core.getInput('version');
    await download(filename, version);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
