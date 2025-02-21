import * as core from "@actions/core";
import * as path from 'path';
import {ok} from 'assert'
import * as toolCache from '@actions/tool-cache';

import {execSync} from "child_process";

const NPM_REVOPUSH_CLI_NAME = "@revopush/code-push-cli"

export function presence(input: string | null | undefined): string | undefined {
    return (input || '').trim() || undefined;
}

export async function installRevopushCLI(version: string): Promise<string> {
    const url = execSync(`npm view ${NPM_REVOPUSH_CLI_NAME}@${version} dist.tarball`).toString().trim();
    core.debug(`Tarball URL: ${url}`)
    const filename = path.basename(url);

    const downloadedTool = await toolCache.downloadTool(url, `${_getTempDirectory}/${filename}`, undefined);
    core.debug(`Download path: ${downloadedTool}`)


    const installToPath = `${_getTempDirectory}/${path.parse(filename).name}` // delete extension such as .tgz
    core.debug(`Install to path: ${installToPath}`)

    execSync(`npm install --prefix ${installToPath} ${downloadedTool}`)
    await toolCache.cacheDir(installToPath, 'revopush', version);

    core.addPath(`${installToPath}/node_modules/.bin`);

    return installToPath
}


function _getTempDirectory(): string {
    const tempDirectory = process.env['RUNNER_TEMP'] || ''
    ok(tempDirectory, 'Expected RUNNER_TEMP to be defined')
    return tempDirectory
}
