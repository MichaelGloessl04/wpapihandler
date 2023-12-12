import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { HeaderError, InvalidURLError } from './errors/errors';


export type ServerData = 
  | {
      status: 200,
      data: Array<Object>
    }
  | {
      status: number,
      error: Error
    };


interface Headers {
  'Content-Type': string,
  'Authorization': string;
  [key: string]: string;
}

export default class WPApiHandler {
  private server_address: string;
  private headers: AxiosRequestConfig;

  constructor(server_address: string, headers: Headers) {
    const axiosHeaders: AxiosRequestConfig['headers'] = headers;
    this.server_address = server_address;
    this.headers = { headers: axiosHeaders };
    this.check_connection();
  }

  async post_len(): Promise<number> {
    try {
        const response = await axios.get(
            `${this.server_address}/wp-json/wp/v2/posts/`,
            this.headers
        )
        return parseInt(response.headers['x-wp-total']);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
  }

  async get_events(id?: string): Promise<Object> {
    let endpoint: string = this.server_address + '/wp-json/tribe/events/v1/events/';
    if (id !== undefined) {
      endpoint += id;
    }
    return await this.execute_get(endpoint);
  }

  async get_posts(id?: string): Promise<ServerData> {
    let total: number = await this.post_len();
    if (id !== undefined) {
      let response: any = await this.execute_get(
        `${this.server_address}/wp-json/wp/v2/posts/${id}`
      );
      if (response[0] == 200) {
        return {
          status: 200,
          data: [response[2]]
        };
      } else {
        return {
          status: response[0],
          error: Error(response[1])
        };
      }
    } else {
      return await this.get_amount(total);
    }
  }

  async check_connection(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.server_address}/wp-json/`,
        this.headers
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
        `${this.server_address}/wp-json/wp/v2/posts/?page=${i++}&per_page=100`
      );
      if (response[0] == 200) {
        posts.push(response[2]);
      } else {
        return {
          status: response[0],
          error: Error(response[1])
        }
      }
      amount -= perPage;
    }

    return {
      status: 200,
      data: [...posts]
    };
  }

  private async execute_get(endpoint: string): Promise<Array<Object>> {
    try {
      const response = await axios.get(
        endpoint,
        this.headers
      );
      return [response.status, response.statusText, response.data];
    } catch (error: any) {
      console.error('Error:', error.message);
      throw error;
    }
  }
}