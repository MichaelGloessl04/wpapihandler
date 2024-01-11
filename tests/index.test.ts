import axios from 'axios';
import { WPApiHandler } from '../index';
import { Buffer } from 'buffer';

require('dotenv').config();


describe('WPApiHandler', () => {
  const encode = (str: string): string =>
      Buffer.from(str, 'binary').toString('base64');
  const login = `${process.env.LOGIN}:${process.env.PASSWORD}`
  const serverAddress = 'https://dev.htlweiz.at/wordpress';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${encode(login)}`,
  };

  describe('post_len', () => {
    it('should return the total number of posts', async () => {
      // Arrange
      const wpa = new WPApiHandler(serverAddress, headers);

      // Act
      const totalPosts = await wpa.post_len();

      // Assert
      expect(totalPosts).toBeGreaterThan(0);
    });

    it('should throw an error if the request fails', async () => {
      // Arrange
      const wpa = new WPApiHandler('WRONG', headers);

      // Act & Assert
      await expect(wpa.post_len()).toThrow();
    });
  });

  describe('get_posts', () => {
    it('should retrieve all posts if no ID is specified', async () => {
      // Arrange
      const wpa = new WPApiHandler(serverAddress, headers);

      // Act
      const result: any = await wpa.get_posts();

      // Assert
      expect(result.status).toBe(200);
      expect(result.data).toBeDefined();
    }, 10000);

    it('should retrieve a specific post if ID is specified', async () => {
      // Arrange
      const wpa = new WPApiHandler(serverAddress, headers);
      const postId = '123';

      // Act
      const result: any = await wpa.get_posts(postId);

      // Assert
      expect(result.status).toBe(200);
      expect(result.data).toBeDefined();
    });

    it('should return an error if the specified post does not exist', async () => {
      // Arrange
      const wpa = new WPApiHandler(serverAddress, headers);
      const nonExistentPostId = '999';

      // Act
      const result: any = await wpa.get_posts(nonExistentPostId);

      // Assert
      expect(result.status).not.toBe(200);
      expect(result.error).toBeDefined();
    });
  });

  describe('post_post', () => {
    it('should post a new post to the WordPress site', async () => {
      // Arrange
      const wpa = new WPApiHandler(serverAddress, headers);
      const newPost = {
        title: 'New Post',
        content: 'This is a new post.',
        status: 'publish',
      };

      // Act
      const result: any = await wpa.post_post(newPost);

      // Assert
      expect(result.status).toBe(200);
      expect(result.data).toBeDefined();
    });

    it('should throw an error if the request fails', async () => {
      // Arrange
      const wpa = new WPApiHandler(serverAddress, headers);
      const invalidPost = {
        title: 'Invalid Post',
        content: 'This post is invalid.',
        status: 'publish',
      };

      // Act & Assert
      await expect(wpa.post_post(invalidPost)).rejects.toThrow(Error);
    });
  });

  describe('check_connection', () => {
    it('should return true if the connection is successful', async () => {
      // Arrange
      const wpa = new WPApiHandler(serverAddress, headers);

      // Act
      const isConnected = await wpa.check_connection();

      // Assert
      expect(isConnected).toBe(true);
    });

    it('should throw an error if the URL is invalid', async () => {
      // Arrange
      const invalidServerAddress = 'https://invalid-url.com';
      const wpa = new WPApiHandler(invalidServerAddress, headers);

      // Act & Assert
      await expect(wpa.check_connection()).rejects.toThrow(Error);
    });

    it('should throw an error if there is an issue with the headers', async () => {
      // Arrange
      const invalidHeaders = {
        'Content-Type': 'application/json',
        Authorization: 'InvalidToken',
      };
      const wpa = new WPApiHandler(serverAddress, invalidHeaders);

      // Act & Assert
      await expect(wpa.check_connection()).rejects.toThrow(Error);
    });

    it('should throw an error if an unexpected error occurs', async () => {
      // Arrange
      const wpa = new WPApiHandler(serverAddress, headers);
      // Mocking the axios.get method to throw an error
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Unexpected error'));

      // Act & Assert
      await expect(wpa.check_connection()).rejects.toThrow(Error);
    });
  });
});