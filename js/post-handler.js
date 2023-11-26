const axios = require('axios')


module.exports = class PostHandler {
    #headers;
    #server_address;

    /**
    * Creates a new instance of the PostHandler class.
    *
    * @constructor
    * @param {string} server_address - The base server address for the WordPress REST API.
    * @param {Object} headers - The headers to be included in the HTTP requests.
    * @param {string} headers.authorization - The authorization token for authenticating requests.
    *
    * @example
    * const serverAddress = 'https://example.com';
    * const headers = {
    *   authorization: 'Basic YOUR_ACCESS_TOKEN',
    * };
    *
    * const ph = new PostHandler(serverAddress, headers);
    */
    constructor(server_address, headers) {
        this.#server_address = server_address + '/wp-json/wp/v2/posts';
        this.#headers = headers;
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
    * const options1 = { id: '990' };
    * const options2 = { amount: 5 }; // Get first 5 posts
    * const options3 = {}; // Retrieves all posts
    *
    * try {
    *   const posts1 = await get_posts(options1);
    *   const posts2 = await get_posts(options2);
    *   const posts3 = await get_posts(options3);
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
            return [this.#execute(`${this.#server_address}/${id}`)];
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

    async #get_amount(amount) {
        let posts = [];
        for (let i = 1; i <= (amount / 100) + 1; i++) {
            posts.push(await this.#execute(
                `${this.#server_address}?page=${i}&per_page=100`)
            );
        }
        return [].concat(...posts);
    }



    async #execute(endpoint) {
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

    async #len() {
        let amount
        const response = await axios.get(
            this.#server_address,
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