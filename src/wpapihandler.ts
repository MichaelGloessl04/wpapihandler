import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Headers, Post, ApiPost } from './types/types';
import { AuthenticationError } from './errors/error';


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
        this.server_address = server_address;
        this.headers = { headers };
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
        try {
            const response = await axios.get(
                `${this.server_address}/wp-json/wp/v2/posts/`,
                this.headers,
            );
            return parseInt(response.headers['x-wp-total']);
        } catch (error) {
            console.error('Error fetching data:', error);
            return 0;
        }
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
        const total: number = await this.post_len();
        if (id !== undefined) {
            const response: AxiosResponse = await axios.get(
                `${this.server_address}/wp-json/wp/v2/posts/${id}`,
                this.headers
            );
            const post: Post = {
                id: response.data.id,
                title: response.data.title.rendered,
                content: response.data.content.rendered,
                status: response.data.status,
                tags: await this.get_tags(response.data.tags),
            };
            return [ post ];
        } else {
            return await this.get_amount(total);
        }
    }

    /**
     * Asynchronously posts a post to the WordPress site.
     *
     * @async
     * @param {Post} [new_post]: The post to be posted to the WordPress site.
     * @returns {Promise<Post>} A promise that resolves to the post that was posted.
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
     *      id: 1910,
     *      title: 'New Post',
     *      content: 'This is a new post.',
     *      status: 'publish',
     *      tags: ['test'],
     * };
     *
     * const result = await wpa.add_post(new_post);
     * console.log(result);
     */
    async add_post(new_post: Post): Promise<Post> {
        const tag_ids: Array<number> = [];
        for (const tag of new_post.tags) {
            const tagId = await this.get_tag_slug(tag);
            tag_ids.push(tagId);
        }

        const out_post: ApiPost = {
            title: new_post.title,
            content: new_post.content,
            status: new_post.status,
            tags: tag_ids,
        };

        try {
            const response: AxiosResponse = await axios.post(
                `${this.server_address}/wp-json/wp/v2/posts/`,
                out_post,
                this.headers,
            );
            
            const control_post: Post = {
                id: response.data.id,
                title: response.data.title.rendered,
                content: response.data.content.rendered,
                status: response.data.status,
                tags: await this.get_tags(response.data.tags),
            };
            return control_post;
        } catch (error) {
            console.error('Error fetching data:', error);
            return {
                id: -1,
                title: '',
                content: '',
                status: '',
                tags: [],
            };
        }
    }

    /**
     * Asynchronously updates a post on the WordPress site.
     *
     * @async
     * @param {Post} [updated_post]: The post to be updated on the WordPress site.
     * @throws {@link AuthenticationError} If the authentication failed.
     * @returns {Promise<Post>} A promise that resolves to the post that was updated.
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
     * const updated_post = {
     *      id: 1910,
     *      title: 'Updated Post',
     *      content: 'This is an updated post.',
     *      status: 'publish',
     *      tags: [1, 2, 3],
     * };
     *
     * const result = await wpa.update_post(updated_post);
     * console.log(result);
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
        } catch (error: any) {
            if (error.response.data.code === 'incorrect_password' ||
                error.response.data.code === 'invalid_username') {
                throw new AuthenticationError(`Authentication failed because of: ${error.response.data.code}`);
            } else {
                console.error('Error fetching data:', error.response.data.code);
                return false;
            }
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
    public async get_tags(tag_ids: number[]): Promise<string[]> {
        const promises = tag_ids.map(async (tag_id: number) => {
            const response: AxiosResponse = await axios.get(
                `${this.server_address}/wp-json/wp/v2/tags/${tag_id}`,
                this.headers,
            );
            return response.data.name;
        });

        const tags = await Promise.all(promises);

        return tags;
    }

    /**
     * Asynchronously retrieves the tag ID by its slug.
     * 
     * @async
     * @param {string} tag - The slug of the tag to be retrieved.
     * @param {boolean} [createIfNotExists=false] - Whether to create the tag if it does not exist.
     * @returns {Promise<number>} A promise that resolves to the ID of the tag.
     * @throws {Error} If the tag does not exist and createIfNotExists is false.
     * 
     * @example
     * const wpa = new WPApiHandler(
     *     'https://example.com',
     *    {
     *       "Content-Type": "application/json",
     *       "Authorization": "Basic YOURACCESSTOKEN"
     *    }
     * );
     * 
     * const tag_id = await wpa.get_tag_slug('test');
     * console.log(tag_id);
     * 
     */
    async get_tag_slug(tag: string, createIfNotExists: boolean = false): Promise<number> {
        const response = await axios.get(
            `${this.server_address}/wp-json/wp/v2/tags?search=${tag}`,
            this.headers,
        );

        if (response.data.length === 0) {
            if (createIfNotExists) {
                return await this.add_tag(tag);
            } else {
                throw new Error(`Tag slug '${tag}' does not exist.`);
            }
        }

        return response.data[0].id;
    }

    private async add_tag(tag: string): Promise<number> {
        const response = await axios.post(
            `${this.server_address}/wp-json/wp/v2/tags`,
            {
                name: tag,
                slug: tag,
            },
            this.headers,
        );

        return response.data.id;
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
