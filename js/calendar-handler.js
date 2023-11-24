const axios = require('axios');

module.exports = class CalendarHandler {
    constructor(api_path, header) {
        this.api_path = api_path;
        this.headers = header;
    }

    async get_events(id) {
        const endpoint = this.api_path + 'events/';
        if (id !== undefined) {
            endpoint += id;
        }
        try {
            const response = await axios.get(
                endpoint,
                { headers: this.headers }
            )
            return response.data.events;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async new_event(payload) {
        const endpoint = this.api_path + 'events/';
        try {
            const response = await axios.post(
                endpoint,
                payload,
                { headers: this.headers }
            );
        
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async remove_event(id) {
        const endpoint = this.api_path + 'events/' + id;
        try {
            const response = await axios.delete(
                endpoint,
                { headers: this.headers }
            )
            return response.data.events;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}
