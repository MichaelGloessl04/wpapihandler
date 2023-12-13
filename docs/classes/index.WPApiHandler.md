[wpapihandler](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / WPApiHandler

# Class: WPApiHandler

[index](../modules/index.md).WPApiHandler

## Table of contents

### Constructors

- [constructor](index.WPApiHandler.md#constructor)

### Properties

- [headers](index.WPApiHandler.md#headers)
- [server\_address](index.WPApiHandler.md#server_address)

### Methods

- [check\_connection](index.WPApiHandler.md#check_connection)
- [execute\_get](index.WPApiHandler.md#execute_get)
- [get\_amount](index.WPApiHandler.md#get_amount)
- [get\_events](index.WPApiHandler.md#get_events)
- [get\_posts](index.WPApiHandler.md#get_posts)
- [post\_len](index.WPApiHandler.md#post_len)
- [post\_post](index.WPApiHandler.md#post_post)

## Constructors

### constructor

• **new WPApiHandler**(`server_address`, `headers`): [`WPApiHandler`](index.WPApiHandler.md)

Creates a new instance of the WPApiHandler class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `server_address` | `string` | The base server address for the WordPress site. |
| `headers` | [`Headers`](../interfaces/index.Headers.md) | The headers to be included in the HTTP requests. |

#### Returns

[`WPApiHandler`](index.WPApiHandler.md)

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

[index.ts:46](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/index.ts#L46)

## Properties

### headers

• `Private` **headers**: `AxiosRequestConfig`\<`any`\>

#### Defined in

[index.ts:28](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/index.ts#L28)

___

### server\_address

• `Private` **server\_address**: `string`

#### Defined in

[index.ts:27](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/index.ts#L27)

## Methods

### check\_connection

▸ **check_connection**(): `Promise`\<`boolean`\>

Asynchronously checks the connection to the WordPress site by making a request to the wp-json endpoint.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if the connection is successful, and `false` otherwise.

**`Async`**

**`Throws`**

InvalidURLError if the URL is invalid.

**`Throws`**

HeaderError if there is an issue with the headers, such as an invalid username or password.

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

[index.ts:220](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/index.ts#L220)

___

### execute\_get

▸ **execute_get**(`endpoint`): `Promise`\<`Object`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | `string` |

#### Returns

`Promise`\<`Object`[]\>

#### Defined in

[index.ts:277](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/index.ts#L277)

___

### get\_amount

▸ **get_amount**(`amount`): `Promise`\<[`ServerData`](../modules/index.md#serverdata)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` |

#### Returns

`Promise`\<[`ServerData`](../modules/index.md#serverdata)\>

#### Defined in

[index.ts:248](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/index.ts#L248)

___

### get\_events

▸ **get_events**(`id?`): `Promise`\<`Object`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id?` | `string` |

#### Returns

`Promise`\<`Object`\>

**`Deprecated`**

The method should not be used

#### Defined in

[index.ts:86](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/index.ts#L86)

___

### get\_posts

▸ **get_posts**(`id?`): `Promise`\<[`ServerData`](../modules/index.md#serverdata)\>

Asynchronously retrieves WordPress posts based on the provided ID or retrieves all posts if no ID is specified.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id?` | `string` | The ID of a specific post to retrieve. If not provided, retrieves all posts. |

#### Returns

`Promise`\<[`ServerData`](../modules/index.md#serverdata)\>

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

[index.ts:126](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/index.ts#L126)

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

[index.ts:70](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/index.ts#L70)

___

### post\_post

▸ **post_post**(`new_post?`): `Promise`\<[`ServerData`](../modules/index.md#serverdata)\>

Asynchronously posts a new post to the WordPress site.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `new_post?` | [`Post`](../modules/index.md#post) | The post to be posted to the WordPress site. |

#### Returns

`Promise`\<[`ServerData`](../modules/index.md#serverdata)\>

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

[index.ts:172](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/index.ts#L172)
