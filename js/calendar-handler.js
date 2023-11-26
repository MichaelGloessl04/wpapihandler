const axios = require('axios');


module.exports = class CalendarHandler {
    #headers;
    #server_address;
    /**
     * Creates a new instance of the CalendarHandler class.
     *
     * @constructor
     * @param {string} server_address - The base server address for the WordPress Tribe Events API.
     * @param {Object} headers - The headers to be included in the HTTP requests.
     * @param {string} headers.authorization - The authorization token for authenticating requests.
     *
     * @example
     * const serverAddress = 'https://example.com';
     * const headers = {
     *   authorization: 'Basic YOUR_ACCESS_TOKEN',
     * };
     *
     * const calendarHandler = new CalendarHandler(serverAddress, headers);
     */
    constructor(server_address, headers) {
        this.#server_address = server_address + '/wordpress/wp-json/tribe/events/v1/';
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
     * const calendarHandler = new CalendarHandler(serverAddress, headers);
     *
     * try {
     *   const allEvents = await calendarHandler.get_events(); // Retrieves all events
     *   const specificEvent = await calendarHandler.get_events('eventID'); // Retrieves a specific event
     *   console.log(allEvents); // Array of events
     * } catch (error) {
     *   console.error(error.message);
     * }
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
     * Asynchronously creates a new event using the WordPress Tribe Events API.
     *
     * @async
     * @param {Object} payload - The data payload for creating a new event.
     * @returns {Promise<void>} A promise that resolves when the event creation is successful.
     * @throws {Error} If an error occurs during the execution of the method.
     *
     * @example
     * const calendarHandler = new CalendarHandler(serverAddress, headers);
     * const eventPayload = {
     *   title: 'New Event',
     *   start_date: '2023-12-01',
     *   end_date: '2023-12-02',
     *   // Add other necessary properties
     * };
     *
     * try {
     *   await calendarHandler.new_event(eventPayload);
     *   console.log('Event created successfully.');
     * } catch (error) {
     *   console.error(error.message);
     * }
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
     * Asynchronously removes an event from the WordPress Tribe Events API based on the provided ID.
     *
     * @async
     * @param {string} id - The ID of the event to be removed.
     * @returns {Promise<void>} A promise that resolves when the event removal is successful.
     * @throws {Error} If an error occurs during the execution of the method.
     *
     * @example
     * const calendarHandler = new CalendarHandler(serverAddress, headers);
     * const eventIdToRemove = 'eventID';
     *
     * try {
     *   await calendarHandler.remove_event(eventIdToRemove);
     *   console.log('Event removed successfully.');
     * } catch (error) {
     *   console.error(error.message);
     * }
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
