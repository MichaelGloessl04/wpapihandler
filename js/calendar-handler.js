const axios = require('axios');


module.exports = class CalendarHandler {
    #headers;
    #server_address;
    /**
     * Interacts with the 'the events calendar' wordpress plugin api.
     * @param {any} server_address should be a valid wp installation address.
     * @param {any} headers access token.
     */
    constructor(server_address, headers) {
        this.#server_address = server_address + '/wordpress/wp-json/tribe/events/v1/';
        this.#headers = headers;
    }

    /**
     * Return events from the databank.
     * If id is left undefined then all events get returned.
     * @param {any} id (optional) id of the desired event.
     * @returns {array} list of events.
     */
    async get_events(id) {
        const endpoint = this.#server_address + 'events/';
        if (id !== undefined) {
            endpoint += id;
        }
        try {
            const response = await axios.get(
                endpoint,
                { headers: this.#headers }
            )
            return response.data.events;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    /**
     * Add a new event to the database.
     * @param {dict} payload should contain at least id keyword. all other properties are optional.
     */
    async new_event(payload) {
        const endpoint = this.#server_address + 'events/';
        try {
            const response = await axios.post(
                endpoint,
                payload,
                { headers: this.#headers }
            );
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    /**
     * Remove event.
     * @param {any} id id of the desired event.
     */
    async remove_event(id) {
        const endpoint = this.#server_address + 'events/' + id;
        try {
            const response = await axios.delete(
                endpoint,
                { headers: this.#headers }
            )
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}
