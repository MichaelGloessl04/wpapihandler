import exp from 'constants';
import { Post } from '../src/types/types';
import { WPApiHandler } from '../src/wpapihandler';
import { Buffer } from 'buffer';

require('dotenv').config();


describe('(1) WPApiHandler', () => {
  const encode = (str: string): string =>
      Buffer.from(str, 'binary').toString('base64');
  const login = `${process.env.LOGIN}:${process.env.PASSWORD}`
  const serverAddress = 'https://dev.htlweiz.at/wordpress';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${encode(login)}`,
  };

  describe('(1) post_len', () => {
    it('(1) should return the total number of posts', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      const totalPosts = await wpa.post_len();

      expect(totalPosts).toBeGreaterThan(0);
    });
  });

  describe('(2) get_posts', () => {
    it('(1) should return all posts', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const posts: Post[] = await wpa.get_posts();

        posts.forEach((post) => {
          expect(isPost(post)).toBe(true);
        });

        expect(posts.length).toBeGreaterThan(0);
      } catch (error) {
        fail();
      }
    }, 10000);

    it('(2) should return post with specified id', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const posts: Array<Post> = await wpa.get_posts('1910');
        if (posts.length > 0) {
          const post: Post = posts[0]!;  // TODO: find a way to not use the ! operator
          expect(isPost(post)).toBe(true);

          expect(post.id).toEqual(1910);
          expect(post.title).toEqual('Test');
          expect(post.content).toEqual('\n<p>Test Content</p>\n');
          expect(post.status).toEqual('draft');
          expect(post.tags).toEqual(['test']);
        } else {
          fail('No posts returned');
        }
      } catch (error) {
        fail();
      }
    });
  });

  describe('(3) get_tags', () => {
    it('(1) should return all tags', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);
      const tag_ids: number[] = [49];

      try {
        const tags: Array<string> = await wpa.get_tags(tag_ids);

        expect(tags.length).toBeGreaterThan(0);
        expect(tags[0]).toEqual('test');
      } catch (error) {
        fail();
      }
    });

    it('(2) should return empty array if no tags are found', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);
      const tag_ids: number[] = [];

      try {
        const tags: Array<string> = await wpa.get_tags(tag_ids);

        expect(tags.length).toEqual(0);
      } catch (error) {
        fail();
      }
    });

    it('(3) should throw a TypeError if tag_ids is not an array of numbers', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);
      const tag_ids: any = 'test';

      try {
        await wpa.get_tags(tag_ids);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
      }
    });
  });

  describe('(4) check_connection', () => {
    it('(1) should return true if connection is established', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const result: boolean = await wpa.check_connection();

        expect(result).toBe(true);
      } catch (error) {
        fail();
      }
    });

    it('(2) should return false if connection is not established', async () => {
      const wpa = new WPApiHandler('https://example.com', headers);

      try {
        const result: boolean = await wpa.check_connection();

        expect(result).toBe(false);
      } catch (error) {
        fail();
      }
    });
  });
});

function isPost(post: any): boolean {
  return (
    post.hasOwnProperty('id') &&
    post.hasOwnProperty('title') &&
    post.hasOwnProperty('content') &&
    post.hasOwnProperty('status') &&
    post.hasOwnProperty('tags')
  );
}
