const axios = require('axios');


module.exports = class WPApiHandler {
    #headers;
    #server_address;

    /**
     * Creates a new instance of the WPApiHandler class.
     *
     * @constructor
     * @param {string} server_address - The base server address for the WordPress installation.
     * @param {Object} headers - The headers to be included in the HTTP requests.
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
    constructor(server_address, headers) {
        this.#server_address = server_address;
        this.#headers = headers;
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
    async get_events(id) {
        const endpoint = this.#server_address + '/wp-json/tribe/events/v1/events/';
        if (id !== undefined) {
            endpoint += id;
        }
        this.#execute_get(endpoint);
    }

    /**
     * Asynchronously creates a new event using the WordPress Tribe Events API.
     *
     * @async
     * @param {Object} payload - The data payload for creating a new event.
     * @returns {Promise<void>} A promise that resolves when the event creation is successful.
     * @throws {Error} If an error occurs during the execution of the method.
     *
     * @example
     * const wpa = new WPApiHandler(serverAddress, headers);
     * const eventPayload = {
     *   title: 'New Event',
     *   start_date: '2023-12-01',
     *   end_date: '2023-12-02',
     *   // Add other necessary properties
     * };
     *
     * try {
     *   await wpa.new_event(eventPayload);
     *   console.log('Event created successfully.');
     * } catch (error) {
     *   console.error(error.message);
     * }
     */
    async add_event(payload) {
        const endpoint = this.#server_address + '/wp-json/tribe/events/v1/events/';
        this.#execute_post(endpoint, payload);
    }

    /**
     * Asynchronously removes an event from the WordPress Tribe Events API based on the provided ID.
     *
     * @async
     * @param {string} id - The ID of the event to be removed.
     * @returns {Promise<void>} A promise that resolves when the event removal is successful.
     * @throws {Error} If an error occurs during the execution of the method.
     *
     * @example
     * const wpa = new WPApiHandler(serverAddress, headers);
     * const eventIdToRemove = 'eventID';
     *
     * try {
     *   await wpa.remove_event(eventIdToRemove);
     *   console.log('Event removed successfully.');
     * } catch (error) {
     *   console.error(error.message);
     * }
     */
    async remove_event(id) {
        const endpoint = this.#server_address + '/wp-json/tribe/events/v1/events/' + id;
        this.#execute_delete(endpoint);
    }
    
    /**
    * Asynchronously retrieves an array of WordPress posts based on the provided options.
    *
    * @async
    * @param {Object} options - The options for retrieving posts.
    * @param {string} [options.id='None'] - The ID of a specific post to retrieve.
    * @param {number} [options.amount='None'] - The number of posts to retrieve.
    * @returns {Promise<Array>} A promise that resolves to an array of WordPress posts.
    * @throws {Error} If an error occurs during the execution of the method.
    *
    * @example
    * const wpa = new WPApiHandler(serverAddress, headers);
    * 
    * const options1 = { id: '990' };
    * const options2 = { amount: 5 }; // Get first 5 posts
    * const options3 = {}; // Retrieves all posts
    *
    * try {
    *   const posts1 = await wpa.get_posts(options1);
    *   const posts2 = await wpa.get_posts(options2);
    *   const posts3 = await wpa.get_posts(options3);
    *   console.log(posts1); // Array of WordPress posts
    * } catch (error) {
    *   console.error(error.message);
    * }
    */
    async get_posts(options) {
        var id = this.#opt(options, 'id', 'None');
        var amount = this.#opt(options, 'amount', 'None');

        let total = await this.#len();

        if (id !== 'None') {
            return [this.#execute_get(`${this.#server_address}/wp-json/wp/v2/posts/${id}`)];
        } else if (amount !== 'None') {
            if (amount >= total[0]) {
                return this.#get_amount(total[0]);
            } else {
                return this.#get_amount(amount);
            }
        } else {
            return this.#get_amount(total[0]);
        }
    }

    /**
     * Asynchronously adds a new post to the WordPress site using the provided payload.
     *
     * @async
     * @param {Object} payload - The data payload for creating a new post.
     * @returns {Promise<Object>} A promise that resolves to the response object from the server.
     * @throws {Error} If an error occurs during the execution of the method.
     *
     * @example
     * const wpa = new WPApiHandler(serverAddress, headers);
     * const postPayload = {
     *   title: 'New Post',
     *   content: 'This is the content of the new post.',
     *   // Add other necessary properties
     * };
     *
     * try {
     *   const response = await wpa.add_post(postPayload);
     *   console.log('Post added successfully:', response.data);
     * } catch (error) {
     *   console.error(error.message);
     * }
     */
    async add_post(payload) {
        this.#execute_post(`${this.#server_address}/wp-json/wp/v2/posts/`,
                           payload)
    }

    async #get_amount(amount) {
        let posts = [];
        for (let i = 1; i <= (amount / 100) + 1; i++) {
            posts.push(await this.#execute_get(
                `${this.#server_address}/wp-json/wp/v2/posts/?page=${i}&per_page=100`)
            );
        }
        return [].concat(...posts);
    }

    async #execute_get(endpoint) {
        try {
            const response = await axios.get(
                endpoint,
                { headers: this.#headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async #execute_post(endpoint, payload) {
        try {
            const response = await axios.get(
                endpoint,
                payload,
                { headers: this.#headers }
            );
            return response;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async #execute_delete(endpoint) {
        try {
            const response = await axios.delete(
                endpoint,
                { headers: this.#headers }
            );
            return response;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async #len() {
        let amount
        await axios.get(
            `${this.#server_address}/wp-json/wp/v2/posts/`,
            { headers: this.#headers }
        )
        .then(function (response){
            amount = [response.headers['x-wp-total'],
                      response.headers['x-wp-totalpages']];
        })
        return amount;
    }

    #opt(options, name, normal) {
        return options && options[name]!==undefined ? options[name] : normal;
    }
}