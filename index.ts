import axios, { AxiosRequestConfig } from 'axios';
import { HeaderError, InvalidURLError } from './errors/errors';

export type ServerData =
    | {
          status: 200;
          data: Array<Object>;
      }
    | {
          status: number;
          error: Error;
      };

export interface Headers {
    'Content-Type': string;
    Authorization: string;
    [key: string]: string;
}

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
     * @throws Will throw an error if the request fails.
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
     * @deprecated The method should not be used
     */
    async get_events(id?: string): Promise<Object> {
        let endpoint: string =
            this.server_address + '/wp-json/tribe/events/v1/events/';
        if (id !== undefined) {
            endpoint += id;
        }
        return await this.execute_get(endpoint);
    }

    /**
     * Asynchronously retrieves WordPress posts based on the provided ID or retrieves all posts if no ID is specified.
     *
     * @async
     * @param {string} [id] - The ID of a specific post to retrieve. If not provided, retrieves all posts.
     * @returns {Promise<ServerData>} A promise that resolves to an object containing the status and data/error of the request.
     * @throws {@link Error} If an unexpected error occurs during the execution of the method.
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
    async get_posts(id?: string): Promise<ServerData> {
        let total: number = await this.post_len();
        if (id !== undefined) {
            let response: any = await this.execute_get(
                `${this.server_address}/wp-json/wp/v2/posts/${id}`,
            );
            if (response[0] == 200) {
                return {
                    status: 200,
                    data: [response[2]],
                };
            } else {
                return {
                    status: response[0],
                    error: Error(response[1]),
                };
            }
        } else {
            return await this.get_amount(total);
        }
    }

    /**
     * Asynchronously checks the connection to the WordPress site by making a request to the wp-json endpoint.
     *
     * @async
     * @returns {Promise<boolean>} A promise that resolves to `true` if the connection is successful, and `false` otherwise.
     * @throws {@link InvalidURLError} If the URL is invalid.
     * @throws {@link HeaderError} If there is an issue with the headers, such as an invalid username or password.
     * @throws {@link Error} If an unexpected error occurs during the execution of the method.
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
                console.log('Connection successful!');
                return true;
            } else {
                console.error(`Unexpected response status: ${response.status}`);
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

    private async get_amount(amount: number): Promise<ServerData> {
        let posts: Array<Object> = [];
        let i: number = 1;

        while (amount > 0) {
            const perPage: number = Math.min(amount, 100);

            let response: any = await this.execute_get(
                `${
                    this.server_address
                }/wp-json/wp/v2/posts/?page=${i++}&per_page=100`,
            );
            if (response[0] == 200) {
                posts.push(response[2]);
            } else {
                return {
                    status: response[0],
                    error: Error(response[1]),
                };
            }
            amount -= perPage;
        }

        return {
            status: 200,
            data: [...posts],
        };
    }

    private async execute_get(endpoint: string): Promise<Array<Object>> {
        try {
            const response = await axios.get(endpoint, this.headers);
            return [response.status, response.statusText, response.data];
        } catch (error: any) {
            console.error('Error:', error.message);
            throw error;
        }
    }
}
