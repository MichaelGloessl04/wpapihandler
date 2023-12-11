import chalk from "chalk";

import { dummy_success, dummy_fail, dummy_error } from "./dummy";
import { test_wpa_init } from "./test_wpapihandler";


const tests: (() => boolean)[] = [
    dummy_success,
    dummy_fail,
    test_wpa_init
];


for (const test of tests) {
    try {        
        console.log(`Executing test: ${test.name}`);
        if (test()) {
            console.log(chalk.green(`Function ${test.name} executed successfully.\n`));
        } else {
            throw new Error(chalk.yellow(`Function ${test.name} failed.\n`));
        }
    } catch (error: any) {
        if (error.message == `Function ${test.name} failed.\n`) {
            throw error;
        } else {
            console.error(
                chalk.red(`Function ${test.name} failed with error:`, error, "\n")
            );
            throw error;
        }
    }
}
