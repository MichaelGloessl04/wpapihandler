import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Headers, Post, ApiPost, Partner, Personnel, Event } from './types/types';
import { AuthenticationError, PostNotFoundError } from './errors/error';


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
     * @param {number} [id]: The ID of the post to be retrieved.
     * @param {string[]} [tags]: The tags of the posts to be retrieved.
     * @returns {Promise<Post[]>} A promise that resolves to an array of posts.
     * @throws {@link PostNotFoundError} If the post does not exist.
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
     * const post = await wpa.get_posts(1910);
     * console.log(post);
     * 
     * const posts = await wpa.get_posts(undefined, ['test']);
     * console.log(posts);
     */
    async get_posts(id?: number, tags?: string[]): Promise<Array<Post>> {
        const total: number = await this.post_len();
        if (id !== undefined) {
            try {
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
            } catch (error: any) {
                if (error.response.data.code === 'rest_post_invalid_id') {
                    throw new PostNotFoundError(`Post with ID '${id}' does not exist.`);
                } else {
                    console.error('Error fetching data:', error.response.data.code);
                    return [];
                }
            }
        } else if (tags !== undefined) {
            const tag_ids: Array<number> = [];
            for (const tag of tags) {
                const tagId = await this.get_tag_slug(tag);
                tag_ids.push(tagId);
            }

            const response: AxiosResponse = await axios.get(
                `${this.server_address}/wp-json/wp/v2/posts?tags=${tag_ids.join(',')}`,
                this.headers,
            );

            const posts: Array<Post> = [];
            
            try {
                for (const post of response.data) {
                    let current_post: Post = {
                        id: post.id,
                        title: post.title.rendered,
                        content: post.content.rendered,
                        status: post.status,
                        tags: await this.get_tags(post.tags),
                    };
                    posts.push(current_post);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                return [];
            }

            return posts;
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
     * Asynchronously removes a post from the WordPress site.
     *
     * @async
     * @param {number} [id]: The ID of the post to be removed from the WordPress site.
     * @returns {Promise<void>} A promise that resolves to void.
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
     * await wpa.remove_post(1910);
     */
    async remove_post(id: number): Promise<void> {
        try {
            await axios.delete(
                `${this.server_address}/wp-json/wp/v2/posts/${id}?force=true`,
                this.headers,
            );
        } catch (error) {
            console.error('Error fetching data:', error);
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

    /**
     * Asynchronously retrieves the partners from the WordPress site.
     *
     * @async
     * @param {string} [project]: The project of the partners to be retrieved.
     * @returns {Promise<Partner[]>} A promise that resolves to an array of partners.
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
     * const partners = await wpa.get_partners();
     * console.log(partners);
     *
     * const partners = await wpa.get_partners('Test');
     * console.log(partners);
     */
    public async get_partners(project?: string): Promise<Array<Partner>> {
        let url = `${this.server_address}/wp-json/wp/v2/partners/`

        if (project !== undefined) {
            url += `?project=${project}`;
        }

        const response: AxiosResponse = await axios.get(
            url,
            this.headers,
        );

        const partners: Array<Partner> = response.data.map((partner: Partner) => {
            return {
                id: partner.id,
                name: partner.name,
                logo: partner.logo,
                url: partner.url,
                level: partner.level,
                project: partner.project,
            };
        });

        return partners;
    }

    /**
     * Asynchronously retrieves the personnel from the WordPress site.
     *
     * @async
     * @param {string} [search] - The search term to filter the personnel.
     * @returns {Promise<Array<Personnel>>} A promise that resolves to an array of personnel.
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
     * const personnel = await wpa.get_personnel();
     * console.log(personnel);
     *
     * const personnel = await wpa.get_personnel('John Doe');
     * console.log(personnel);
     */
    public async get_personnel(search?: string): Promise<Array<Personnel>> {
        let url = `${this.server_address}/wp-json/wp/v2/personnel/`

        if (search !== undefined) {
            url += `?search=${search}`;
        }

        const response: AxiosResponse = await axios.get(
            url,
            this.headers,
        );

        const personnel: Array<Personnel> = response.data.map((person: Personnel) => {
            return {
                id: person.id,
                name: person.name,
                short: person.short,
                title: person.title,
                slug: person.slug,
                department: person.department,
                description: person.description,
                image: person.image,
                email_to: person.email_to,
                office_hours: person.office_hours,
                location: person.location,
                tags: person.tags,
                active: person.active,
            };
        });

        return personnel;
    }

    /**
     * Asynchronously retrieves the events from the WordPress site.
     *
     * @async
     * @param {number} [event_id] - The ID of a specific event to be retrieved.
     * @returns {Promise<Array<Event>>} A promise that resolves to an array of events.
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
     * const events = await wpa.get_events();
     * console.log(events);
     *
     * const events = await wpa.get_events(1);
     * console.log(events);
     */
    public async get_events(event_id?: number): Promise<Array<Event>> {
        let url = `${this.server_address}/wp-json/wp/v2/school-events/`

        if (event_id) {
            url += `?event_id=${event_id}`
        }

        const response: AxiosResponse = await axios.get(
            url,
            this.headers,
        );

        return response.data.map((event: Event) => {
            return {
                id: event.id,
                title: event.title,
                content: event.content,
                image: event.image,
                active: event.active
            };
        })
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
