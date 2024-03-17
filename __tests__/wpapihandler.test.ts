import { Post, Partner } from '../src/types/types';
import { AuthenticationError, PostNotFoundError } from '../src/errors/error';
import { WPApiHandler } from '../src/wpapihandler';
import { Buffer } from 'buffer';
import axios, { AxiosResponse } from 'axios';

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
      /**
       * @description Test if the constructor creates a new instance of WPApiHandler
       * @expect instance of WPApiHandler is created
       * @fails if the constructor does not create a new instance of WPApiHandler or throws an error
       */
      const wpa = new WPApiHandler(serverAddress, headers);

      expect(wpa).toBeInstanceOf(WPApiHandler);
    });
  });

  describe('post_len', () => {
    it('should return the total number of posts', async () => {
      /**
       * @description Test if the method post_len returns the total number of posts
       * @expect total number of posts is greater than 0
       * @fails if the method does not return the total number of posts or throws an error
       */
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
      /**
       * @description Test if the method get_posts returns all posts
       * @expect every returned object is a post
       * @expect more than 0 posts are returned
       * @fails if the method does not return all posts or throws an error
       */
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
      /**
       * @description Test if the method get_posts returns the post with the specified id
       * @expect returned object is a post
       * @expect the returned post has the specified id
       * @expect the returned post has the specified title
       * @expect the returned post has the specified content
       * @expect the returned post has the specified status
       * @expect the returned post has the specified tags
       * @fails if the method does not return the post with the specified id or throws an error
       */
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const posts: Array<Post> = await wpa.get_posts(1910);
        if (posts.length > 0) {
          const post: Post = posts[0]!;  // TODO: find a way to not use the ! operator
          expect(isPost(post)).toBe(true);

          expect(post.id).toEqual(1910);
          expect(post.title).toEqual('Test');
          expect(post.content).toEqual(
              '\n<p>Test Content</p>\n\n\n\n<figure class="wp-block-image size-full"><img decoding="async" src="https://dev.htlweiz.at/wordpress/wp-content/uploads/2024/03/test_3.png" alt="" class="wp-image-2143"/></figure>\n',
          );
          expect(post.status).toEqual('publish');
          expect(post.tags).toEqual(['test']);
        } else {
          fail();
        }
      } catch (error) {
        fail();
      }
    });

    it('should throw PostNotFoundError if the post does not exist', async () => {
        /**
         * @description Test if the method remove_post throws a PostNotFoundError if the post does not exist
         * @expect a PostNotFoundError is thrown
         * @fails if the method does not throw a PostNotFoundError or throws a different error
         */
        const wpa = new WPApiHandler(serverAddress, headers);
        const post_id = 0;

        try {
            await wpa.get_posts(post_id);
            fail();
        } catch (error: any) {
            expect(error).toBeInstanceOf(PostNotFoundError);
            expect(error.message).toEqual(
                `Post with ID '${post_id}' does not exist.`,
            );
        }
    });

    it('should throw PostNotFoundError if the post does not exist', async () => {
        /**
         * @description Test if the method remove_post throws a PostNotFoundError if the post does not exist
         * @expect a PostNotFoundError is thrown
         * @fails if the method does not throw a PostNotFoundError or throws a different error
         */
        const wpa = new WPApiHandler(serverAddress, headers);
        const post_id = 0;

        try {
            await wpa.get_posts(post_id);
            fail();
        } catch (error: any) {
            expect(error).toBeInstanceOf(PostNotFoundError);
            expect(error.message).toEqual(
                `Post with ID '${post_id}' does not exist.`,
            );
        }
    });
  
    it('should return all posts with specified tags', async () => {
      const wpa = new WPApiHandler(serverAddress, headers);
      const tags: string[] = ['test'];

      try {
        const posts: Array<Post> = await wpa.get_posts(undefined, tags);
        expect(posts.length).toEqual(1);
        posts.forEach((post) => {
          expect(isPost(post)).toBe(true);
          expect(post.tags).toEqual(tags);
        });
      } catch (error) {
        fail();
      }
    });
  });

  describe('get_tags', () => {
    it('should return all tags', async () => {
      /**
       * @description Test if the method get_tags returns all tags
       * @expect more than 0 tags are returned
       * @expect the returned tag has the name 'test'
       * @fails if the method does not return all tags or throws an error
       */
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
      /**
       * @description Test if the method get_tags returns an empty array if no tags are found
       * @expect an empty array is returned
       * @fails if the method does not return an empty array or throws an error
       */
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
      /**
       * @description Test if the method get_tags throws a TypeError if tag_ids is not an array of numbers
       * @expect a TypeError is thrown
       * @fails if the method does not throw a TypeError or throws a different error
       */
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
      /**
       * @description Test if the method check_connection returns true if the connection is established
       * @expect true is returned
       * @fails if the method does not return true or throws an error
       */
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const result: boolean = await wpa.check_connection();

        expect(result).toBe(true);
      } catch (error) {
        fail();
      }
    });

    it('should return false if connection is not established', async () => {
      /**
       * @description Test if the method check_connection returns false if the connection is not established
       * @expect false is returned
       * @fails if the method does not return false or throws an error
       */
      const wpa = new WPApiHandler('https://example.com', headers);

      try {
        const result: boolean = await wpa.check_connection();

        expect(result).toBe(false);
      } catch (error) {
        fail();
      }
    });

    it('should throw an error if the password is incorrect', async () => {
      /**
       * @description Test if the method check_connection throws an error if the password is incorrect
       * @expect an AuthenticationError is thrown
       * @expect the error message is 'Authentication failed because of: incorrect_password'
       * @fails if the method does not throw an AuthenticationError or throws a different error
       * @fails if the error message is not 'Authentication failed because of: incorrect_password'
       */
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
      /**
       * @description Test if the method check_connection throws an error if the user could not be found
       * @expect an AuthenticationError is thrown
       * @expect the error message is 'Authentication failed because of: invalid_username'
       * @fails if the method does not throw an AuthenticationError or throws a different error
       * @fails if the error message is not 'Authentication failed because of: invalid_username'
       */
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
      /**
       * @description Test if the method add_post adds a new post
       * @expect the returned object is a post
       * @expect the returned post has the specified title
       * @expect the returned post has the specified content
       * @expect the returned post has the specified status
       * @expect the returned post has the specified tags
       * @fails if the method does not add a new post or throws an error
       */
      const wpa = new WPApiHandler(serverAddress, headers);

      const new_post: Post = {
        title: 'New Post',
        content: 'This is a new post.',
        status: 'draft',
        tags: ['test'],
      };

      try {
        const created_post: Post = await wpa.add_post(new_post);

        expect(isPost(created_post)).toBe(true);
        expect(created_post.title).toEqual(new_post.title);
        const striped = created_post.content.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');
        expect(striped).toEqual(new_post.content);
        expect(created_post.status).toEqual(new_post.status);
        expect(created_post.tags).toEqual(new_post.tags);
        await axios.delete(
            `${serverAddress}/wp-json/wp/v2/posts/${created_post.id}?force=true`,
            {
                headers: headers,
            },
        );
      } catch (error) {
        fail();
      }
    });

    it('should throw a TypeError if the post is not of type Post', async () => {
      /**
       * @description Test if the method add_post throws a TypeError if the post is not of type Post
       * @expect a TypeError is thrown
       * @fails if the method does not throw a TypeError or throws a different error
       */
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

  describe('get_tag_slug', () => {
    it('should return the tag ID if the tag exists', async () => {
      /**
       * @description Test if the method get_tag_slug returns the tag ID if the tag exists
       * @expect the returned tag ID is 49
       * @fails if the method does not return the tag ID or throws an error
       */
      const wpa = new WPApiHandler(serverAddress, headers);
      const tag = 'test';

      try {
        const tagId: number = await wpa.get_tag_slug(tag);

        expect(tagId).toEqual(49);
      } catch (error) {
        fail();
      }
    });

    it('should throw an error if the tag does not exist and createIfNotExists is false', async () => {
      /**
       * @description Test if the method get_tag_slug throws an error if the tag does not exist and createIfNotExists is false
       * @expect an Error is thrown
       * @expect the error message is 'Tag slug 'nonexistenttag' does not exist.'
       * @fails if the method does not throw an Error or throws a different error
       * @fails if the error message is not 'Tag slug 'nonexistenttag' does not exist.'
       */
      const wpa = new WPApiHandler(serverAddress, headers);
      const tag = 'nonexistenttag';
      const createIfNotExists = false;

      try {
        await wpa.get_tag_slug(tag, createIfNotExists);
        fail();
    } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual(
          `Tag slug '${tag}' does not exist.`,
        );
      }
    });

    it('should create a new tag and return its ID if the tag does not exist and createIfNotExists is true', async () => {
      /**
       * @description Test if the method get_tag_slug creates a new tag and returns its ID if the tag does not exist and createIfNotExists is true
       * @expect the returned tag ID is not null
       * @fails if the method does not create a new tag or throws an error
       */
      const wpa = new WPApiHandler(serverAddress, headers);
      const tag = 'newtag';
      const createIfNotExists = true;

      try {
        const tagId: number = await wpa.get_tag_slug(
          tag,
          createIfNotExists,
        );

        expect(tagId).not.toBeNull();

        await axios.delete(`${serverAddress}/wp-json/wp/v2/tags/${tagId}?force=true`, {
          headers: headers,
        });
      } catch (error) {
        fail();
      }
    });
  });

  describe('remove_post', () => {
    it('should remove the post with the specified id', async () => {
      /**
       * @description Create a new post and remove it afterwards.
       * @expect The post should be removed and a 404 error should be thrown when trying to get the post.
       * @fails if the post could not be removed or the post could be found after removal.
       */
      const wpa = new WPApiHandler(serverAddress, headers);
      const new_post = {
        title: 'New Post',
        content: 'This is a new post.',
        status: 'draft'
      };

      let post_id:number = 0;

      try {
        const response: AxiosResponse = await axios.post(
          `${serverAddress}/wp-json/wp/v2/posts`,
          new_post,
          {
            headers: headers,
          },
        );
        post_id = response.data.id;
        expect(response.data.id).toBeGreaterThan(0);
        await wpa.remove_post(post_id);
      } catch (error) {
        fail();
      }
      try {
        const response: AxiosResponse = await axios.get(
          `${serverAddress}/wp-json/wp/v2/posts/${post_id}`,
          {
            headers: headers,
          },
        );
        fail();
      } catch (error: any) {
        expect(error.response.status).toEqual(404);
        expect(error.response.data.code).toEqual('rest_post_invalid_id');
      }
    });
  });

  describe('get_partners', () => {
    it('should return all partners', async () => {
      /**
       * @description Test if the method get_partners returns all partners
       * @expect every returned object is a partner
       * @expect more than 0 partners are returned
       * @fails if the method does not return all partners or throws an error
       */
      const wpa = new WPApiHandler(serverAddress, headers);

      try {
        const partners: Array<Partner> = await wpa.get_partners();

        expect(partners.length).toBeGreaterThan(0);

        for(const partner of partners) {
          expect(isPartner(partner)).toBe(true);
        }
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


function isPartner(partner: any): boolean {
  return (
    partner.hasOwnProperty('id') &&
    partner.hasOwnProperty('name') &&
    partner.hasOwnProperty('logo') &&
    partner.hasOwnProperty('url') &&
    partner.hasOwnProperty('project') &&
    partner.hasOwnProperty('level')
  );
}
