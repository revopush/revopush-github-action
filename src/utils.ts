import * as core from "@actions/core";
import * as path from 'path';
import * as toolCache from '@actions/tool-cache';

import {execSync} from "child_process";

const NPM_REVOPUSH_CLI_NAME = "@revopush/code-push-cli"

export function presence(input: string | null | undefined): string | undefined {
    return (input || '').trim() || undefined;
}

export async function installRevopushCLI(version: string): Promise<string> {
    const url = execSync(`npm view ${NPM_REVOPUSH_CLI_NAME}@${version} dist.tarball`).toString().trim();

    const downloadPath = await toolCache.downloadTool(url, undefined, undefined);
    const installToPath = path.basename(downloadPath).split(".")[0] // delete extension such as .tgz
    execSync(`npm install --prefix ${installToPath} ${downloadPath}`)
    await toolCache.cacheDir(installToPath, 'revopush', version);

    core.addPath(`${installToPath}/node_modules/.bin`);

    return installToPath
}
