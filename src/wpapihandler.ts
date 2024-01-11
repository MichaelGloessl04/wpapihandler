import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { InvalidURLError, HeaderError } from './errors/errors';
import { Headers, Post, WPResponse } from './types/types';


export class WPApiHandler {
    private server_address: string;
    private headers: AxiosRequestConfig;

    /**
     * Creates a new instance of the WPApiHandler class.
     *
     * @constructor
     * @param {string} server_address - The base server address for the WordPress site.
     * @param {Headers} headers - The headers to be included in the HTTP requests.
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
        this.check_connection();
    }

    /**
     * Fetches the total number of posts from the WordPress site.
     *
     * @returns {Promise<number>} A promise that resolves to the total number of posts.
     *
     * @throws {@link Error} if the request fails.
     *
     * @example
     * const wpa = new WPApiHandler(
     *     'https://example.com',
     *     {
     *         "Content-Type": "application/json",
     *         "Authorization": "Basic YOURACCESSTOKEN"
     *     }
     * );
     * const totalPosts = await wpa.post_len();
     */
    async post_len(): Promise<number> {
        try {
            const response = await axios.get(
                `${this.server_address}/wp-json/wp/v2/posts/`,
                this.headers,
            );
            return parseInt(response.headers['x-wp-total']);
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    /**
     * Asynchronously retrieves WordPress posts based on the provided ID or retrieves all posts if no ID is specified.
     *
     * @async
     * @param {string} [id] - The ID of a specific post to retrieve. If not provided, retrieves all posts.
     * @returns {Promise<WPResponse>} A promise that resolves to an object containing the status and data/error of the request.
     * @throws {@link Error} if an unexpected error occurs during the execution of the method.
     *
     * @example
     * const wpa = new WPApiHandler(
     *     'https://example.com',
     *     {
     *          "Content-Type": "application/json",
     *          "Authorization": "Basic YOURACCESSTOKEN"
     *      }
     * );
     *
     * // Retrieves all posts
     * const result = await wpa.get_posts();
     * console.log(result.status, result.data);
     *
     * // Alternatively, to retrieve a specific post
     * const specificPost = await wpa.get_posts('postId');
     * console.log(specificPost.status, specificPost.data);
     *
     * // If an an error occurs during the GET Request
     * non_existent_post_id = 0;
     * const errorPost = await wpa.get_posts(non_existent_post_id);
     * console.error(errorPost.status, specificPost.error);
     *
     */
    async get_posts(id?: string): Promise<WPResponse> {
        let total: number = await this.post_len();
        if (id !== undefined) {
            let response: AxiosResponse = await axios.get(
                `${this.server_address}/wp-json/wp/v2/posts/${id}`,
                this.headers
            );
            if (response.status == 200) {
                let post: Post = {
                    title: response.data.title.rendered,
                    content: response.data.content.rendered,
                    status: response.data.status,
                };
                return {
                    status: 200,
                    posts: post,
                };
            } else {
                return {
                    status: response.status,
                    error: Error(response.statusText),
                };
            }
        } else {
            return await this.get_amount(total);
        }
    }

    /**
     * Asynchronously posts a new post to the WordPress site.
     *
     * @param {Post} [new_post]: The post to be posted to the WordPress site.
     * @returns {Promise<WPResponse>} A promise that resolves to an object containing the status and data/error of the request.
     * @throws {@link Error} if an unexpected error occurs during the execution of the method.
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
     * };
     *
     * const result = await wpa.post_post(new_post);
     * console.log(result.status, result.data);
     */
    async post_post(new_post: Post): Promise<WPResponse> {
        try {
            const response = await axios.post(
                `${this.server_address}/wp-json/wp/v2/posts/`,
                new_post,
                this.headers,
            );
            return {
                status: 200,
                response: response.data,
            };
        } catch (error: any) {
            return {
                status: error.response.status,
                error: Error(error.response.statusText),
            };
        }
    }

    /**
     * Asynchronously checks the connection to the WordPress site by making a request to the wp-json endpoint.
     *
     * @async
     * @returns {Promise<boolean>} A promise that resolves to `true` if the connection is successful, and `false` otherwise.
     * @throws {@link InvalidURLError} if the URL is invalid.
     * @throws {@link HeaderError} if there is an issue with the headers, such as an invalid username or password.
     * @throws {@link Error} if an unexpected error occurs during the execution of the method.
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
     * try {
     *      const isConnected = await wpa.check_connection();
     *      if (isConnected) {
     *          console.log('Connected to the WordPress site.');
     *      } else {
     *          console.log('Connection failed.');
     *      }
     * } catch (error) {
     *      console.error(error.message);
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
                return false;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ENOTFOUND') {
                    throw new InvalidURLError('Invalid URL.');
                } else if (error.response?.data.code === 'invalid_username') {
                    throw new HeaderError('Invalid username or password.');
                } else {
                    throw error;
                }
            } else {
                console.error('An unexpected error occurred:', error);
                return false;
            }
        }
    }

    private async get_amount(amount: number): Promise<WPResponse> {
        let posts: Array<Post> = [];
        let i: number = 1;

        while (amount > 0) {
            const perPage: number = Math.min(amount, 100);

            let response: AxiosResponse = await axios.get(
                `${this.server_address}/wp-json/wp/v2/posts/?page=${i++}&per_page=100`,
                this.headers,
            );
            if (response.status == 200) {
                response.data.forEach((post: any) => {
                    let current_post: Post = {
                        title: post.title.rendered,
                        content: post.content.rendered,
                        status: post.status,
                        };
                    posts.push(current_post);
                });
            } else {
                return {
                    status: response.status,
                    error: Error(response.statusText),
                };
            }
            amount -= perPage;
        }

        return {
            status: 200,
            posts: posts,
        };
    }
}
