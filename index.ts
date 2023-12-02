import axios, { AxiosError, AxiosResponse, AxiosHeaders } from 'axios';

interface Headers {
  authorization: string;
}

export default class WPApiHandler {
  private headers: AxiosHeaders;
  private server_address: string;

  /**
   * Creates a new instance of the WPApiHandler class.
   *
   * @constructor
   * @param {string} server_address - The base server address for the WordPress installation.
   * @param {Headers} headers - The headers to be included in the HTTP requests.
   * @param {string} headers.authorization - The authorization token for authenticating requests.
   *
   * @example
   * const serverAddress = 'https://example.com';
   * const headers = {
   *   authorization: 'Basic YOUR_ACCESS_TOKEN',
   * };
   *
   * const wpa = new WPApiHandler(serverAddress, headers);
   */
  constructor(server_address: string, headers: AxiosHeaders) {
    this.server_address = server_address;
    this.headers = headers;
  }

  /**
   * Asynchronously retrieves the total number of WordPress posts.
   *
   * @async
   * @returns {Promise<number>} A promise that resolves to the total number of WordPress posts.
   * @throws {Error} If an error occurs during the execution of the method.
   *
   * @example
   * const wpApiHandler = new WPApiHandler(serverAddress, headers);
   *
   * try {
   *   const totalPosts = await wpApiHandler.post_len();
   *   console.log('Total number of posts:', totalPosts);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  async post_len(): Promise<number> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.server_address}/wp-json/wp/v2/posts/`,
        { headers: this.headers }
      );

      return parseInt(response.headers['x-wp-total']);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Rethrow the error or handle it appropriately
    }
  }

  /**
   * Asynchronously retrieves events from the WordPress Tribe Events API based on the provided ID.
   *
   * @async
   * @param {string} [id] - The ID of a specific event to retrieve. If not provided, retrieves all events.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of events.
   * @throws {Error} If an error occurs during the execution of the method.
   *
   * @example
   * const wpa = new WPApiHandler(serverAddress, headers);
   *
   * try {
   *   const allEvents = await wpa.get_events(); // Retrieves all events
   *   const specificEvent = await wpa.get_events('eventID'); // Retrieves a specific event
   *   console.log(allEvents); // Array of events
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  async get_events(id?: string): Promise<Array<Object>> {
    let endpoint: string = this.server_address + '/wp-json/tribe/events/v1/events/';
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
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of WordPress posts.
   * @throws {Error} If an error occurs during the execution of the method.
   *
   * @example
   * const wpa = new WPApiHandler(serverAddress, headers);
   * const postIdToRetrieve = 'postId';
   *
   * try {
   *   const posts = await wpa.get_posts(postIdToRetrieve); // Retrieves a specific post
   *   console.log(posts); // Array of WordPress posts
   *
   *   // Alternatively, to retrieve all posts
   *   const allPosts = await wpa.get_posts();
   *   console.log(allPosts); // Array of all WordPress posts
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  async get_posts(id?: string): Promise<Array<Object>> {
    let total: number = await this.post_len();
    if (id !== undefined) {
      return await this.execute_get(`${this.server_address}/wp-json/wp/v2/posts/${id}`);
    } else {
      return await this.get_amount(total);
    }
  }

  private async get_amount(amount: number): Promise<Array<Object>> {
    let posts: Array<Object> = [];
    let i: number = 1;

    while (amount > 0) {
      const perPage: number = Math.min(amount, 100);

      posts.push(await this.execute_get(
        `${this.server_address}/wp-json/wp/v2/posts/?page=${i++}&per_page=100`)
      );

      amount -= perPage;
    }

    return [...posts];
  }

  private async execute_get(endpoint: string): Promise<Array<Object>> {
    try {
      const response: AxiosResponse = await axios.get(
        endpoint,
        { headers: this.headers }
      );
      return [response.data];
    } catch (error: any) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  private async execute_post(endpoint: string, payload: Object): Promise<Object> {
    try {
      const response: AxiosResponse = await axios.post(
        endpoint,
        payload,
        { headers: this.headers }
      );
      return response;
    } catch (error: any) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  private async execute_put(endpoint: string, payload: Object): Promise<Object> {
    try {
      const response: AxiosResponse = await axios.put(
        endpoint,
        payload,
        { headers: this.headers }
      );
      return response;
    } catch (error: any) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  private async execute_delete(endpoint: string): Promise<Object> {
    try {
      const response: AxiosResponse = await axios.delete(
        endpoint,
        { headers: this.headers }
      );
      return response;
    } catch (error: any) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  private opt(options: any, name: string, normal: any): any {
    return options && options[name] !== undefined ? options[name] : normal;
  }
}