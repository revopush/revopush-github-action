import path from 'path';

import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import {getLatestVersion, installRevopushCLI, presence} from "../utils";
import {execSync} from "child_process";

export async function run(): Promise<void> {
    try {
        let version = presence(core.getInput('version'));
        const token = core.getInput('accessKey');

        if (!version) {
            let latestVersion = await getLatestVersion();
            core.debug(`version was unset, defaulting to latest: ${latestVersion}`);
            version = latestVersion;
        }

        // Install the revopush if not already present
        const toolPath = toolCache.find('revopush', version);
        if (toolPath !== '') {
            core.debug(`got cached version of revopush matching "${version}" is installed`);
            core.addPath(path.join(toolPath, '/node_modules/.bin'));
        } else {
            core.debug(`no version of revopush matching "${version}" is installed`);
            await installRevopushCLI(version);
        }

        if (!token) {
            core.info(`Skipped authentication: 'token' not provided.`);
        } else {
            execSync(`revopush login --accessKey ${token}`)
        }

        core.setOutput('version', version);
    } catch (err) {
        core.setFailed(`revopush/revopush-github-action failed with: ${err}`);
    }
}

if (require.main === module) {
    run();
}
