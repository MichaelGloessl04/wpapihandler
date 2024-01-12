import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Headers, Post } from './types/types';


export class WPApiHandler {
    private server_address: string;
    private headers: AxiosRequestConfig;

    /**
     * Creates a new instance of the WPApiHandler class.
     *
     * @constructor
     * @param {string} server_address - The address of the WordPress site.
     * @param {Headers} headers - The headers to be used for the requests.
     *
     * @example
     * const wpa = new WPApiHandler(
     *      'https://example.com',
     *      {
     *          "Content-Type": "application/json",
     *          "Authorization": "Basic YOURACCESSTOKEN"
     *      }
     * );
     */
    constructor(server_address: string, headers: Headers) {
        const axiosHeaders: AxiosRequestConfig['headers'] = headers;
        this.server_address = server_address;
        this.headers = { headers: axiosHeaders };
    }

    /**
     * Asynchronously retrieves the total number of posts on the WordPress site.
     *
     * @async
     * @returns {Promise<number>} A promise that resolves to the total number of posts.
     *
     * @example
     * const wpa = new WPApiHandler(
     *      'https://example.com',
     *      {
     *          "Content-Type": "application/json",
     *          "Authorization": "Basic YOURACCESSTOKEN"
     *      }
     * );
     *
     * const total_posts = await wpa.post_len();
     * console.log(total_posts);
     */
    async post_len(): Promise<number> {
        const response = await axios.get(
            `${this.server_address}/wp-json/wp/v2/posts/`,
            this.headers,
        );
        return parseInt(response.headers['x-wp-total']);
    }

    /**
     * Asynchronously retrieves posts from the WordPress site.
     *
     * @async
     * @param {string} [id]: The ID of the post to be retrieved.
     * @returns {Promise<Post[]>} A promise that resolves to an array of posts.
     *
     * @example
     * const wpa = new WPApiHandler(
     *      'https://example.com',
     *      {
     *          "Content-Type": "application/json",
     *          "Authorization": "Basic YOURACCESSTOKEN"
     *      }
     * );
     *
     * const posts = await wpa.get_posts();
     * console.log(posts);
     *
     * const post = await wpa.get_posts('1910');
     * console.log(post);
     */
    async get_posts(id?: string): Promise<Array<Post>> {
        let total: number = await this.post_len();
        if (id !== undefined) {
            let response: AxiosResponse = await axios.get(
                `${this.server_address}/wp-json/wp/v2/posts/${id}`,
                this.headers
            );
            let post: Post = {
                id: response.data.id,
                title: response.data.title.rendered,
                content: response.data.content.rendered,
                status: response.data.status,
                tags: await this.get_tags(response.data.tags),
            };
            return [post];
        } else {
            return await this.get_amount(total);
        }
    }

    /**
     * Asynchronously creates a new post on the WordPress site.
     *
     * @async
     * @param {Post} [new_post]: The post to be created on the WordPress site.
     * @returns {Promise<Post>} A promise that resolves to the post that was created.
     *
     * @example
     * const wpa = new WPApiHandler(
     *      'https://example.com',
     *      {
     *          "Content-Type": "application/json",
     *          "Authorization": "Basic YOURACCESSTOKEN"
     *      }
     * );
     *
     * const new_post = {
     *      title: 'New Post',
     *      content: 'This is a new post.',
     *      status: 'publish',
     *      tags: [1, 2, 3],
     * };
     *
     * const result = await wpa.post_post(new_post);
     * console.log(result);
     */
    async post_post(new_post: Post): Promise<Post> {
        const response: AxiosResponse = await axios.post(
            `${this.server_address}/wp-json/wp/v2/posts/`,
            new_post,
            this.headers,
        );
        let post: Post = {
            id: response.data.id,
            title: response.data.title.rendered,
            content: response.data.content.rendered,
            status: response.data.status,
            tags: response.data.tags,
        };
        return post;
    }

    /**
     * Checks if the connection to the WordPress site is working.
     *
     * @async
     * @returns {Promise<boolean>} A promise that resolves to true if the connection is working, false otherwise.
     *
     * @example
     * const wpa = new WPApiHandler(
     *      'https://example.com',
     *      {
     *          "Content-Type": "application/json",
     *          "Authorization": "Basic YOURACCESSTOKEN"
     *      }
     * );
     *
     * const result = await wpa.check_connection();
     * 
     * if (result) {
     *     console.log('Connection is working.');
     * } else {
     *    console.log('Connection is not working.');
     * }
     */
    async check_connection(): Promise<boolean> {
        try {
            const response = await axios.get(
                `${this.server_address}/wp-json/`,
                this.headers,
            );
            if (response.status === 200) {
                return true;
            } else {
                console.error('Error fetching data:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return false;
        }
    }

    /**
     * Asynchronously retrieves the tags by their IDs.
     *
     * @async
     * @param {number[]} tag_ids - The IDs of the tags to be retrieved.
     * @returns {Promise<string[]>} A promise that resolves to an array of tags.
     *
     * @example
     * const wpa = new WPApiHandler(
     *      'https://example.com',
     *      {
     *          "Content-Type": "application/json",
     *          "Authorization": "Basic YOURACCESSTOKEN"
     *      }
     * );
     *
     * const tag_ids = [1, 2, 3];
     * const tags = await wpa.get_tags(tag_ids);
     * console.log(tags);
     */
    public async get_tags(tag_ids: number[]): Promise<Array<string>> {
        let tags: Array<string> = [];

        let promises = tag_ids.map(async (tag_id: number) => {
            let response: AxiosResponse = await axios.get(
                `${this.server_address}/wp-json/wp/v2/tags/${tag_id}`,
                this.headers,
            );
            return response.data.name;
        });

        tags = await Promise.all(promises);

        return tags;
    }

    private async get_amount(amount: number): Promise<Array<Post>> {
        let posts: Array<Post> = [];
        let i: number = 1;

        while (amount > 0) {
            const perPage: number = Math.min(amount, 100);

            let response: AxiosResponse = await axios.get(
                `${this.server_address}/wp-json/wp/v2/posts/?page=${i++}&per_page=100`,
                this.headers,
            );

            response.data.forEach((post: any) => {
                let current_post: Post = {
                    id: post.id,
                    title: post.title.rendered,
                    content: post.content.rendered,
                    status: post.status,
                    tags: post.tags,
                    };
                posts.push(current_post);
            });

            amount -= perPage;
        }

        return posts;
    }
}
