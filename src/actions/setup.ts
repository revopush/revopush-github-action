import {addPath, debug, getInput, group, info, setFailed, exportVariable} from '@actions/core';
import {exec} from '@actions/exec';
import path from 'path';
import {ok as assert} from 'assert';
import os from 'os';
import {cacheDir} from "@actions/tool-cache";
import {which, mkdirP} from '@actions/io';
import {executeAction} from "../utils";

export {cacheDir} from '@actions/tool-cache';


export function setupInput() {
    return {
        revopushVersion: getInput('revopush-cli-version') || "latest",
        accessKey: getInput('revopush-access-key'),
    };
}

executeAction(setupAction);

export async function setupAction(input = setupInput()) {
    if (!input.revopushVersion) {
        info(`Skipped installing @revopush/code-push-cli: 'revopush-cli-version' not provided.`);
    } else {

        const version = input.revopushVersion
        const name = '@revopush/code-push-cli'

        await group(`Installing @revopush/code-push-cli (${version})`, async () => {
            const temp = tempPath(name, version);

            await mkdirP(temp);
            await exec('npm', ['add', `${name}@${version}`], {cwd: temp});

            let cliPath = await cacheDir(temp, name, version);
            addPath(path.join(cliPath, 'node_modules', '.bin'));
        })
    }

    if (!input.accessKey) {
        info(`Skipped authentication: 'revopush-access-key' not provided.`);
    } else {
        await group('Validating authenticated account', () =>
            authenticate(input.accessKey, 'revopush')
        );
    }
}

async function authenticate(token: string, cli: string = 'revopush'): Promise<void> {
    if (!cli) {
        info(`Skipped token validation: no CLI installed, can't run 'whoami'.`);
    } else {
       await exec(await which(cli), ['login', '--accessKey', token]);
    }

    exportVariable('EXPO_TOKEN', token);
}

function tempPath(name: string, version: string): string {
    assert(process.env['RUNNER_TEMP'], 'Could not resolve temporary path, RUNNER_TEMP not defined');
    return path.join(process.env['RUNNER_TEMP'], name, version, os.arch());
}
