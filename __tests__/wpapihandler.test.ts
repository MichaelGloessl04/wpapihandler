import { WPApiHandler, ServerData } from '../src/index';
import { Buffer } from 'buffer';
import {  } from '../src/wpapihandler';

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
  });

  describe('get_posts', () => {
    it('should return all posts', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const posts: any = await wpa.get_posts();

        expect(posts.status).toEqual(200);

        expect(posts).toHaveProperty('data');
        expect(posts.data).toBeInstanceOf(Array);
        expect(posts.data.length).toBeGreaterThan(0);
      } catch (error) {
        fail(error);
      }
    });

    it('should return post with specified id', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const post: any = await wpa.get_posts('291');

        expect(post.status).toEqual(200);

        expect(post).toHaveProperty('data');
        expect(post.data).toBeInstanceOf(Object);
        expect(post.data).toHaveProperty('id');
        expect(post.data.id).toEqual(291);
      } catch (error) {
        fail(error);
      }
    });
  });
});
