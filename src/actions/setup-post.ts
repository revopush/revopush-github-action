import {executeAction} from "../utils";
import {exec} from "@actions/exec";
import {which} from "@actions/io";

executeAction(logoutAction);

export async function logoutAction() {
    try {
        await exec(await which("revopush"), ['logout']);
    } catch (ignored) {
        console.log("Failed to logout")
    }
}
