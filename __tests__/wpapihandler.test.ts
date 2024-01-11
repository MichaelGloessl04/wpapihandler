import { Post, WPResponse } from '../src/types/types';
import { WPApiHandler } from '../src/wpapihandler';
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
      const wpa = new WPApiHandler(serverAddress, headers);

      const totalPosts = await wpa.post_len();

      expect(totalPosts).toBeGreaterThan(0);
    });
  });

  describe('get_posts', () => {
    it('should return all posts', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const posts: WPResponse = await wpa.get_posts();

        expect(posts.status).toEqual(200);

        expect(posts).toHaveProperty('data');
        expect(posts.data).toMatchObject<Post>({
          title: expect.any(String),
          content: expect.any(String),
          status: expect.any(String) });
        expect(posts.data.length).toBeGreaterThan(0);
      } catch (error) {
        fail(error);
      }
    }, 10000);

    it('should return post with specified id', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const post: WPResponse = await wpa.get_posts('291');

        expect(post.status).toEqual(200);

        expect(post).toHaveProperty('posts');
        expect(post.data).toBeInstanceOf(Object);
        expect(post.data).toHaveProperty('id');
        expect(post.data.id).toEqual(291);
      } catch (error) {
        fail(error);
      }
    });
  });
});
