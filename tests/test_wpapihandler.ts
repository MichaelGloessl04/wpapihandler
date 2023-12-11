import * as fs from "fs";
import WPApiHandler from "../index";


function get_config() {
    const filePath: string = "tests/test-data/credentials.json";

    try {
        const fileContents: string = fs.readFileSync(filePath, "utf-8");
        const jsonData = JSON.parse(fileContents);

        return jsonData;
    } catch (error: any) {
            if (error.code === "ENOENT") {
                console.error(`File not found: ${filePath}`);
            } else {
                console.error(`An error occurred: ${error.message}`);
        }
    }
}


export function test_wpa_init(): boolean {
    const config = get_config();
    const wpa = new WPApiHandler (
        config.correct.URL,
        config.correct.headers
    );
    if (!(wpa instanceof WPApiHandler)) {
        return false;
    }
    return true;
}


export async function test_wpa_check_connection(): Promise<boolean> {
    const config = get_config();
    const wpa = new WPApiHandler(config.correct.URL, config.correct.headers);

    try {
        const isConnected = await wpa.check_connection();
        return isConnected;
    } catch (error: any) {
        return false;
    }
}