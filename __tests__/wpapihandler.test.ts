import { Post } from '../src/types/types';
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
        const posts: Post[] = await wpa.get_posts();

        posts.forEach((post) => {
          expect(post).toMatchObject<Post>({
            id: expect.any(Number),
            title: expect.any(String),
            content: expect.any(String),
            status: expect.any(String) as 'publish' | 'draft' | 'trash'});
        });
        expect(posts.length).toBeGreaterThan(0);
      } catch (error) {
        fail();
      }
    }, 10000);

    it('should return post with specified id', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const posts: Array<Post> = await wpa.get_posts('291');
        if (posts.length > 0) {
            const post: Post = posts[0]!;

            expect(post).toMatchObject<Post>({
                id: expect.any(Number),
                title: expect.any(String),
                content: expect.any(String),
                status: expect.any(String) as 'publish' | 'draft' | 'trash',
            });
            expect(post.id).toEqual(291);
        } else {
            fail('No posts returned');
        }
      } catch (error) {
        fail();
      }
    });
  });
});
