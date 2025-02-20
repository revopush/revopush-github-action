import {debug, setFailed} from "@actions/core";


export async function executeAction(action: () => Promise<void>) {
    return action().catch((error: Error) => {
        setFailed(error.message || error);
        debug(error.stack || 'No stacktrace available');
    });
}
