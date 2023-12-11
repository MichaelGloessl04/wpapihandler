import { dummy } from "./dummy";

const tests: (() => boolean)[] = [dummy];

for (const test of tests) {
    try {        
        console.log(`Executing test: ${test.name}`);
        if (test()) {
            console.log(`Function ${test.name} executed successfully.\n`);
        } else {
            console.log(`Function ${test.name} failed.\n`);
        }
    } catch (error) {
        console.error(
            `Function ${test.name} failed with error:`,
            error,
            "\n"
        );
    }
}
