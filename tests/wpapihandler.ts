import * as fs from "fs";
import WPApiHandler from "../index";


function get_config() {
    const filePath: string = "tests/test-data/credentials.json";

    try {
        const fileContents: string = fs.readFileSync(filePath, "utf-8");
        const jsonData = JSON.parse(fileContents);

        console.log("JSON data:");
        console.log(jsonData);
    } catch (error: any) {
            if (error.code === "ENOENT") {
                console.error(`File not found: ${filePath}`);
            } else {
                console.error(`An error occurred: ${error.message}`);
        }
    }
}


export function WPApiHandler_init(): boolean {
    const config = get_config();
    
    return true;
}
