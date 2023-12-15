import chalk from 'chalk';
import { dummy } from './dummy';
import {
    test_wpa_init,
    test_wpa_check_connection,
    test_wpa_post_len,
    test_wpa_get_all_posts,
    test_wpa_post_post,
} from './test_wpapihandler';

const tests: (() => boolean | Promise<boolean>)[] = [
    dummy,
    test_wpa_init,
    test_wpa_check_connection,
    test_wpa_post_len,
    test_wpa_get_all_posts,
    test_wpa_post_post,
];

async function executeTest(test: () => boolean | Promise<boolean>) {
    try {
        console.log(`Executing test: ${test.name}`);
        const result = await test();

        if (result) {
            console.log(chalk.green(`${test.name} executed successfully.\n`));
        } else {
            console.log(chalk.yellow(`${test.name} failed.\n`));
        }
    } catch (error) {
        console.log(chalk.red(`${test.name} failed with error:`, error, '\n'));
    }
}

async function runTests(selectedTest?: string) {
    if (selectedTest) {
        const test = tests.find((t) => t.name === selectedTest);
        if (test) {
            await executeTest(test);
        } else {
            console.log(chalk.red(`Test ${selectedTest} not found.`));
        }
    } else {
        for (const test of tests) {
            try {
                await executeTest(test);
            } catch (error) {
                console.log(
                    chalk.red(`An unexpected error occurred in test:`, error),
                );
            }
        }
    }
}

const selectedTest = process.argv[2];

runTests(selectedTest).catch((error) => {
    console.log(chalk.red(`An unexpected error occurred:`, error));
});
