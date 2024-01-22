# Test Docs

## Table of Contents:
- 1. dummy.test.ts
  - 1.1: dummy
    - 1.1.1: dummy should pass
- 2. wpapihandler.test.ts
  - 2.1: constructor
    - 2.1.1: constructor should create a new instance of WPApiHandler
  - 2.2: post_len
    - 2.2.1: post_len should return the total number of posts
  - 2.3: get_posts
    - 2.3.1: get_posts should return all posts
    - 2.3.2: get_posts should return post with specified id
  - 2.4: get_tags
    - 2.4.1: get_tags should return all tags
    - 2.4.2: get_tags should return empty array if no tags are found
    - 2.4.3: get_tags should throw a TypeError if tag_ids is not an array of numbers
  - 2.5: check_connection
    - 2.5.1: check_connection should return true if connection is established
    - 2.5.2: check_connection should return false if connection is not established
    - 2.5.3: check_connection should throw an error if the password is incorrect
    - 2.5.4: check_connection should throw an error if the user could not be found
  - 2.6: add_post
    - 2.6.1: add_post should add a new post
    - 2.6.2: add_post should throw a TypeError if the post is not of type Post
  - 2.7: get_tag_slug
    - 2.7.1: get_tag_slug should return the tag ID if the tag exists
    - 2.7.2: get_tag_slug should throw an error if the tag does not exist and createIfNotExists is false
    - 2.7.3: get_tag_slug should create a new tag and return its ID if the tag does not exist and createIfNotExists is true


## Test Docs:
### 1. dummy.test.ts
#### 1.1: dummy
##### 1.1.1: dummy should pass
Dummy test to check if the test suite is working

_expect:_
- true

_fails:_
- never



### 2. wpapihandler.test.ts
#### 2.1: constructor
##### 2.1.1: constructor should create a new instance of WPApiHandler
Test if the constructor creates a new instance of WPApiHandler

_expect:_
- instance of WPApiHandler is created

_fails:_
- if the constructor does not create a new instance of WPApiHandler or throws an error


#### 2.2: post_len
##### 2.2.1: post_len should return the total number of posts
Test if the method post_len returns the total number of posts

_expect:_
- total number of posts is greater than 0

_fails:_
- if the method does not return the total number of posts or throws an error


#### 2.3: get_posts
##### 2.3.1: get_posts should return all posts
Test if the method get_posts returns all posts

_expect:_
- every returned object is a post
- more than 0 posts are returned

_fails:_
- if the method does not return all posts or throws an error

##### 2.3.2: get_posts should return post with specified id
Test if the method get_posts returns all posts

_expect:_
- every returned object is a post
- more than 0 posts are returned

_fails:_
- if the method does not return all posts or throws an error


#### 2.4: get_tags
##### 2.4.1: get_tags should return all tags
Test if the method get_tags returns all tags

_expect:_
- more than 0 tags are returned
- the returned tag has the name 'test'

_fails:_
- if the method does not return all tags or throws an error

##### 2.4.2: get_tags should return empty array if no tags are found
Test if the method get_tags returns all tags

_expect:_
- more than 0 tags are returned
- the returned tag has the name 'test'

_fails:_
- if the method does not return all tags or throws an error

##### 2.4.3: get_tags should throw a TypeError if tag_ids is not an array of numbers
Test if the method get_tags returns all tags

_expect:_
- more than 0 tags are returned
- the returned tag has the name 'test'

_fails:_
- if the method does not return all tags or throws an error


#### 2.5: check_connection
##### 2.5.1: check_connection should return true if connection is established
Test if the method check_connection returns true if the connection is established

_expect:_
- true is returned

_fails:_
- if the method does not return true or throws an error

##### 2.5.2: check_connection should return false if connection is not established
Test if the method check_connection returns true if the connection is established

_expect:_
- true is returned

_fails:_
- if the method does not return true or throws an error

##### 2.5.3: check_connection should throw an error if the password is incorrect
Test if the method check_connection returns true if the connection is established

_expect:_
- true is returned

_fails:_
- if the method does not return true or throws an error

##### 2.5.4: check_connection should throw an error if the user could not be found
Test if the method check_connection returns true if the connection is established

_expect:_
- true is returned

_fails:_
- if the method does not return true or throws an error


#### 2.6: add_post
##### 2.6.1: add_post should add a new post
Test if the method add_post adds a new post

_expect:_
- the returned object is a post
- the returned post has the specified title
- the returned post has the specified content
- the returned post has the specified status
- the returned post has the specified tags

_fails:_
- if the method does not add a new post or throws an error

##### 2.6.2: add_post should throw a TypeError if the post is not of type Post
Test if the method add_post adds a new post

_expect:_
- the returned object is a post
- the returned post has the specified title
- the returned post has the specified content
- the returned post has the specified status
- the returned post has the specified tags

_fails:_
- if the method does not add a new post or throws an error


#### 2.7: get_tag_slug
##### 2.7.1: get_tag_slug should return the tag ID if the tag exists
Test if the method get_tag_slug returns the tag ID if the tag exists

_expect:_
- the returned tag ID is 49

_fails:_
- if the method does not return the tag ID or throws an error

##### 2.7.2: get_tag_slug should throw an error if the tag does not exist and createIfNotExists is false
Test if the method get_tag_slug returns the tag ID if the tag exists

_expect:_
- the returned tag ID is 49

_fails:_
- if the method does not return the tag ID or throws an error

##### 2.7.3: get_tag_slug should create a new tag and return its ID if the tag does not exist and createIfNotExists is true
Test if the method get_tag_slug returns the tag ID if the tag exists

_expect:_
- the returned tag ID is 49

_fails:_
- if the method does not return the tag ID or throws an error