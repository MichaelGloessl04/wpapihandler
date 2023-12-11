import chalk from "chalk";

import { dummy } from "./dummy";
import { test_wpa_init } from "./test_wpapihandler";
import { AssertionError } from "assert";


const tests: (() => boolean)[] = [
    dummy,
    test_wpa_init
];


for (const test of tests) {
    try {        
        console.log(`Executing test: ${test.name}`);
        if (test()) {
            console.log(chalk.green(`${test.name} executed successfully.\n`));
        } else {
            throw new AssertionError({message: chalk.yellow(`${test.name} failed.\n`)});
        }
    } catch (error: any) {
        if (error.message == `${test.name} failed.\n`) {
            throw error;
        } else {
            console.error(
                chalk.red(`${test.name} failed with error:`, error.message, "\n")
            );
            throw error;
        }
    }
}
