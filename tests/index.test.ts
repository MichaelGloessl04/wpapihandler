import axios from 'axios';
import { WPApiHandler } from '../index';

jest.mock('axios');

describe('WPApiHandler', () => {
  const serverAddress = 'https://dev.htlweiz.at/wordpress';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${process.env.ACCESS_TOKEN}`,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('post_len', () => {
    it('should return the total number of posts', async () => {
      const response = {
        headers: {
          'x-wp-total': '10',
        },
      };
      axios.get = jest.fn().mockResolvedValue(response);

      const wpa = new WPApiHandler(serverAddress, headers);
      const result = await wpa.post_len();

      expect(result).toBe(10);
      expect(axios.get).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/wp/v2/posts/`,
        { headers }
      );
    });

    it('should throw an error if the request fails', async () => {
      const error = new Error('Request failed');
      (axios.get as jest.Mock).mockRejectedValue(error);

      const wpa = new WPApiHandler(serverAddress, headers);

      await expect(wpa.post_len()).rejects.toThrowError(error);
      expect(axios.get).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/wp/v2/posts/`,
        { headers }
      );
    });
  });

  describe('get_posts', () => {
    it('should retrieve all posts if no ID is specified', async () => {
      const totalPosts = 10;
      const response = {
        status: 200,
        data: [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }],
      };
      (axios.get as jest.Mock).mockResolvedValue(response);

      const wpa = new WPApiHandler(serverAddress, headers);
      const result = await wpa.get_posts();

      expect(result).toEqual({
        status: 200,
        data: response.data,
      });
      expect(axios.get).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/wp/v2/posts/?page=1&per_page=100`,
        { headers }
      );
      expect(axios.get).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/wp/v2/posts/?page=2&per_page=100`,
        { headers }
      );
    });

    it('should retrieve a specific post if ID is specified', async () => {
      const postId = '1';
      const response = {
        status: 200,
        data: { id: 1, title: 'Post 1' },
      };
      (axios.get as jest.Mock).mockResolvedValue(response);

      const wpa = new WPApiHandler(serverAddress, headers);
      const result = await wpa.get_posts(postId);

      expect(result).toEqual({
        status: 200,
        data: response.data,
      });
      expect(axios.get).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/wp/v2/posts/${postId}`,
        { headers }
      );
    });

    it('should return an error if the request fails', async () => {
      const postId = '1';
      const error = new Error('Request failed');
      (axios.get as jest.Mock).mockRejectedValue(error);

      const wpa = new WPApiHandler(serverAddress, headers);

      await expect(wpa.get_posts(postId)).rejects.toThrowError(error);
      expect(axios.get).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/wp/v2/posts/${postId}`,
        { headers }
      );
    });
  });

  describe('post_post', () => {
    it('should post a new post to the WordPress site', async () => {
      const newPost = {
        title: 'New Post',
        content: 'This is a new post.',
        status: 'publish',
      };
      const response = {
        status: 200,
        data: { id: 1, title: 'New Post' },
      };
      (axios.post as jest.Mock).mockResolvedValue(response);

      const wpa = new WPApiHandler(serverAddress, headers);
      const result = await wpa.post_post(newPost);

      expect(result).toEqual({
        status: 200,
        data: response.data,
      });
      expect(axios.post).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/wp/v2/posts/`,
        newPost,
        { headers }
      );
    });

    it('should return an error if the request fails', async () => {
      const newPost = {
        title: 'New Post',
        content: 'This is a new post.',
        status: 'publish',
      };
      const error = new Error('Request failed');
      (axios.post as jest.Mock).mockRejectedValue(error);

      const wpa = new WPApiHandler(serverAddress, headers);

      await expect(wpa.post_post(newPost)).rejects.toThrowError(error);
      expect(axios.post).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/wp/v2/posts/`,
        newPost,
        { headers }
      );
    });
  });

  describe('check_connection', () => {
    it('should return true if the connection is successful', async () => {
      const response = {
        status: 200,
      };
      (axios.get as jest.Mock).mockResolvedValue(response);

      const wpa = new WPApiHandler(serverAddress, headers);
      const result = await wpa.check_connection();

      expect(result).toBe(true);
      expect(axios.get).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/`,
        { headers }
      );
    });

    it('should throw an InvalidURLError if the URL is invalid', async () => {
      const error = {
        code: 'ENOTFOUND',
      };
      (axios.get as jest.Mock).mockRejectedValue(error);

      const wpa = new WPApiHandler(serverAddress, headers);

      await expect(wpa.check_connection()).rejects.toThrowError(
        'Invalid URL.'
      );
      expect(axios.get).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/`,
        { headers }
      );
    });

    it('should throw a HeaderError if there is an issue with the headers', async () => {
      const error = {
        response: {
          data: {
            code: 'invalid_username',
          },
        },
      };
      (axios.get as jest.Mock).mockRejectedValue(error);

      const wpa = new WPApiHandler(serverAddress, headers);

      await expect(wpa.check_connection()).rejects.toThrowError(
        'Invalid username or password.'
      );
      expect(axios.get).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/`,
        { headers }
      );
    });

    it('should throw an error if the request fails', async () => {
      const error = new Error('Request failed');
      (axios.get as jest.Mock).mockRejectedValue(error);

      const wpa = new WPApiHandler(serverAddress, headers);

      await expect(wpa.check_connection()).rejects.toThrowError(error);
      expect(axios.get).toHaveBeenCalledWith(
        `${serverAddress}/wp-json/`,
        { headers }
      );
    });
  });
});