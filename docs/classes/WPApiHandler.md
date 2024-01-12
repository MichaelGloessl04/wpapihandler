[wpapihandler](../README.md) / [Exports](../modules.md) / WPApiHandler

# Class: WPApiHandler

## Table of contents

### Constructors

- [constructor](WPApiHandler.md#constructor)

### Properties

- [headers](WPApiHandler.md#headers)
- [server\_address](WPApiHandler.md#server_address)

### Methods

- [check\_connection](WPApiHandler.md#check_connection)
- [get\_amount](WPApiHandler.md#get_amount)
- [get\_posts](WPApiHandler.md#get_posts)
- [post\_len](WPApiHandler.md#post_len)
- [post\_post](WPApiHandler.md#post_post)

## Constructors

### constructor

• **new WPApiHandler**(`server_address`, `headers`): [`WPApiHandler`](WPApiHandler.md)

Creates a new instance of the WPApiHandler class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `server_address` | `string` | The base server address for the WordPress site. |
| `headers` | [`Headers`](../interfaces/Headers.md) | The headers to be included in the HTTP requests. |

#### Returns

[`WPApiHandler`](WPApiHandler.md)

**`Example`**

```ts
const wpa = new WPApiHandler(
     'https://example.com',
     {
         "Content-Type": "application/json",
         "Authorization": "Basic YOURACCESSTOKEN"
     }
);
```

#### Defined in

[src/wpapihandler.ts:26](https://github.com/MichaelGloessl04/WP_API_Extractor/blob/c19add0/src/wpapihandler.ts#L26)

## Properties

### headers

• `Private` **headers**: `AxiosRequestConfig`\<`any`\>

#### Defined in

[src/wpapihandler.ts:8](https://github.com/MichaelGloessl04/WP_API_Extractor/blob/c19add0/src/wpapihandler.ts#L8)

___

### server\_address

• `Private` **server\_address**: `string`

#### Defined in

[src/wpapihandler.ts:7](https://github.com/MichaelGloessl04/WP_API_Extractor/blob/c19add0/src/wpapihandler.ts#L7)

## Methods

### check\_connection

▸ **check_connection**(): `Promise`\<`boolean`\>

Asynchronously checks the connection to the WordPress site by making a request to the wp-json endpoint.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if the connection is successful, and `false` otherwise.

**`Async`**

**`Throws`**

[InvalidURLError](InvalidURLError.md) if the URL is invalid.

**`Throws`**

[HeaderError](HeaderError.md) if there is an issue with the headers, such as an invalid username or password.

**`Throws`**

Error if an unexpected error occurs during the execution of the method.

**`Example`**

```ts
const wpa = new WPApiHandler(
     'https://example.com',
     {
         "Content-Type": "application/json",
         "Authorization": "Basic YOURACCESSTOKEN"
     }
);

try {
     const isConnected = await wpa.check_connection();
     if (isConnected) {
         console.log('Connected to the WordPress site.');
     } else {
         console.log('Connection failed.');
     }
} catch (error) {
     console.error(error.message);
}
```

#### Defined in

[src/wpapihandler.ts:189](https://github.com/MichaelGloessl04/WP_API_Extractor/blob/c19add0/src/wpapihandler.ts#L189)

___

### get\_amount

▸ **get_amount**(`amount`): `Promise`\<[`ServerData`](../interfaces/ServerData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` |

#### Returns

`Promise`\<[`ServerData`](../interfaces/ServerData.md)\>

#### Defined in

[src/wpapihandler.ts:217](https://github.com/MichaelGloessl04/WP_API_Extractor/blob/c19add0/src/wpapihandler.ts#L217)

___

### get\_posts

▸ **get_posts**(`id?`): `Promise`\<[`ServerData`](../interfaces/ServerData.md)\>

Asynchronously retrieves WordPress posts based on the provided ID or retrieves all posts if no ID is specified.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id?` | `string` | The ID of a specific post to retrieve. If not provided, retrieves all posts. |

#### Returns

`Promise`\<[`ServerData`](../interfaces/ServerData.md)\>

A promise that resolves to an object containing the status and data/error of the request.

**`Async`**

**`Throws`**

Error if an unexpected error occurs during the execution of the method.

**`Example`**

```ts
const wpa = new WPApiHandler(
    'https://example.com',
    {
         "Content-Type": "application/json",
         "Authorization": "Basic YOURACCESSTOKEN"
     }
);

// Retrieves all posts
const result = await wpa.get_posts();
console.log(result.status, result.data);

// Alternatively, to retrieve a specific post
const specificPost = await wpa.get_posts('postId');
console.log(specificPost.status, specificPost.data);

// If an an error occurs during the GET Request
non_existent_post_id = 0;
const errorPost = await wpa.get_posts(non_existent_post_id);
console.error(errorPost.status, specificPost.error);
```

#### Defined in

[src/wpapihandler.ts:94](https://github.com/MichaelGloessl04/WP_API_Extractor/blob/c19add0/src/wpapihandler.ts#L94)

___

### post\_len

▸ **post_len**(): `Promise`\<`number`\>

Fetches the total number of posts from the WordPress site.

#### Returns

`Promise`\<`number`\>

A promise that resolves to the total number of posts.

**`Throws`**

Error if the request fails.

**`Example`**

```ts
const wpa = new WPApiHandler(
    'https://example.com',
    {
        "Content-Type": "application/json",
        "Authorization": "Basic YOURACCESSTOKEN"
    }
);
const totalPosts = await wpa.post_len();
```

#### Defined in

[src/wpapihandler.ts:50](https://github.com/MichaelGloessl04/WP_API_Extractor/blob/c19add0/src/wpapihandler.ts#L50)

___

### post\_post

▸ **post_post**(`new_post?`): `Promise`\<[`ServerData`](../interfaces/ServerData.md)\>

Asynchronously posts a new post to the WordPress site.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `new_post?` | [`Post`](../interfaces/Post.md) | The post to be posted to the WordPress site. |

#### Returns

`Promise`\<[`ServerData`](../interfaces/ServerData.md)\>

A promise that resolves to an object containing the status and data/error of the request.

**`Throws`**

Error if an unexpected error occurs during the execution of the method.

**`Example`**

```ts
const wpa = new WPApiHandler(
     'https://example.com',
     {
         "Content-Type": "application/json",
         "Authorization": "Basic YOURACCESSTOKEN"
     }
);

const new_post = {
     title: 'New Post',
     content: 'This is a new post.',
     status: 'publish',
};

const result = await wpa.post_post(new_post);
console.log(result.status, result.data);
```

#### Defined in

[src/wpapihandler.ts:141](https://github.com/MichaelGloessl04/WP_API_Extractor/blob/c19add0/src/wpapihandler.ts#L141)
