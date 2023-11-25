const axios = require('axios');


module.exports = class PostHandler {
    #headers;
    #server_address;

    constructor(server_address, headers) {
        this.#server_address = server_address + '/wp-json/wp/v2/posts';
        this.#headers = headers;
    }

    async get_posts(options) {
        var id = this.opt(options, 'id', 'None')
        var amount = this.opt(options, 'amount', 'None')

        let total = await this.len();
        let i = 1;

        if (id !== 'None') {
            return await this.execute(`${this.#server_address}/${id}`);
        } else if (amount !== 'None') {
            if (amount > 100 || amount >= total[0]) {
                let posts = []
                let iter_end;

                while (amount > 100) {
                    iter_end = `${this.#server_address}?page=${i}&per_page=${amount}`
                    posts.push(await this.execute(iter_end));
                    i++;
                    amount -= 100;
                }
                return posts;
            } else {
                return await this.execute(`${this.#server_address}?per_page=${amount}`);
            }
        }
    }

    async execute(endpoint) {
        try {
            const response = await axios.get(
                endpoint,
                { headers: this.#headers }
            )
            return response.data;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async len() {
        let amount;
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

    opt(options, name, normal){
        return options && options[name]!==undefined ? options[name] : normal;
    }
}