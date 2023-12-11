import chalk from "chalk";
import { dummy } from "./dummy";
import {
    test_wpa_init,
    test_wpa_check_connection,
    test_wpa_post_len,
    test_wpa_get_all_posts,
} from "./test_wpapihandler";
import { AssertionError } from "assert";

const tests: (() => boolean | Promise<boolean>)[] = [
    dummy,
    test_wpa_init,
    test_wpa_check_connection,
    test_wpa_post_len,
    test_wpa_get_all_posts,
];

async function executeTest(
        test: () => boolean | Promise<boolean>
    ) {
    try {
        console.log(`Executing test: ${test.name}`);
        const result = await test();

        if (result) {
        console.log(chalk.green(`${test.name} executed successfully.\n`));
        } else {
        throw new AssertionError({
            message: chalk.yellow(`${test.name} failed.\n`),
        });
        }
    } catch (error: any) {
        if (error.message === `${test.name} failed.\n`) {
        throw error;
        } else {
        console.error(
            chalk.red(`${test.name} failed with error:`, error.message, "\n")
        );
        throw error;
        }
    }
}

async function runTests() {
    for (const [index, test] of tests.entries()) {
        await executeTest(test);
    }
}

runTests().catch((error) => {
    console.error(chalk.red(`An unexpected error occurred:`, error));
});
