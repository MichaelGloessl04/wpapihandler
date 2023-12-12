import * as fs from "fs";
import { WPApiHandler } from "../index";
import { ServerData } from "../index";


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

    const isConnected = await wpa.check_connection();
    return isConnected;
}


export async function test_wpa_post_len(): Promise<boolean> {
    const config = get_config();
    const wpa = new WPApiHandler(config.correct.URL, config.correct.headers);
    const nr_of_posts = await wpa.post_len();

    if (nr_of_posts <= 0) {
        console.error("No posts returned.");
        return false;
    }
    return true
}


export async function test_wpa_get_all_posts(): Promise<boolean> {
    const config = get_config();
    const wpa = new WPApiHandler(config.correct.URL, config.correct.headers);
    const posts: any = await wpa.get_posts();

    if (posts.status !== 200) {
        console.error("Error fetching posts:", posts.error);
        return false;
    }

    if (!Array.isArray(posts.data)) {
        console.error("Wrong returned object type.");
        return false;
    }

    for (const post_collection of posts.data) {
        for (const post of post_collection) {
            if (typeof post !== 'object' || !post.hasOwnProperty('id')) {
                console.error("Invalid post object:", typeof post);
                return false;
            }
        }
    }

    return true;
}
