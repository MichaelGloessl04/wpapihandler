import { Post } from '../src/types/types';
import { AuthenticationError } from '../src/errors/error';
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
    'Authorization': `Basic ${encode(login)}`,
  };

  describe('constructor', () => {
    it('should create a new instance of WPApiHandler', () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      expect(wpa).toBeInstanceOf(WPApiHandler);
    });
  });

  describe('post_len', () => {
    it('should return the total number of posts', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const totalPosts = await wpa.post_len();

        expect(totalPosts).toBeGreaterThan(0);
      } catch (error) {
        fail();
      }
    });
  });

  describe('get_posts', () => {
    it('should return all posts', async () => {
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

    it('should return post with specified id', async () => {
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

  describe('get_tags', () => {
    it('should return all tags', async () => {
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

    it('should return empty array if no tags are found', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);
      const tag_ids: number[] = [];

      try {
        const tags: Array<string> = await wpa.get_tags(tag_ids);

        expect(tags.length).toEqual(0);
      } catch (error) {
        fail();
      }
    });

    it('should throw a TypeError if tag_ids is not an array of numbers', async () => {
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

  describe('check_connection', () => {
    it('should return true if connection is established', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const result: boolean = await wpa.check_connection();

        expect(result).toBe(true);
      } catch (error) {
        fail();
      }
    });

    it('should return false if connection is not established', async () => {
      const wpa = new WPApiHandler('https://example.com', headers);

      try {
        const result: boolean = await wpa.check_connection();

        expect(result).toBe(false);
      } catch (error) {
        fail();
      }
    });

    it('should throw an error if the password is incorrect', async () => {
      const wrong_headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encode('wpapihandler:test')}`,
      }
      
      const wpa = new WPApiHandler(serverAddress, wrong_headers);

      try {
        const result: boolean = await wpa.check_connection();

        fail();
      } catch (error) {
        if (error instanceof AuthenticationError) {
          expect(error.message).toEqual('Authentication failed because of: incorrect_password');
        } else {
          fail();
        }
      }
    });

    it('should throw an error if the user could not be found', async () => {
      const wrong_headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encode('test:test')}`,
      }

      const wpa = new WPApiHandler(serverAddress, wrong_headers);

      try {
        const result: boolean = await wpa.check_connection();

        fail();
      } catch (error) {
        if (error instanceof AuthenticationError) {
          expect(error.message).toEqual('Authentication failed because of: invalid_username');
        } else {
          fail();
        }
      }
    });
  });

  describe('add_post', () => {
    it('should add a new post', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      const new_post: Post = {
        title: 'New Post',
        content: 'This is a new post.',
        status: 'draft',
        tags: ['test'],
      };

      try {
        const result: Post = await wpa.add_post(new_post);

        expect(isPost(result)).toBe(true);
        expect(result.title).toEqual(new_post.title);
        const striped = result.content.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');
        expect(striped).toEqual(new_post.content);
        expect(result.status).toEqual(new_post.status);
        expect(result.tags).toEqual(new_post.tags);
      } catch (error) {
        fail();
      }
    });

    it('should throw a TypeError if the post is not of type Post', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);

      const new_post: any = 12;

      try {
        await wpa.add_post(new_post);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
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
