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

[index.ts:40](https://github.com/MichaelGloessl04/wpapihandler/blob/e0b843b/index.ts#L40)

## Properties

### headers

• `Private` **headers**: `AxiosRequestConfig`\<`any`\>

#### Defined in

[index.ts:22](https://github.com/MichaelGloessl04/wpapihandler/blob/e0b843b/index.ts#L22)

___

### server\_address

• `Private` **server\_address**: `string`

#### Defined in

[index.ts:21](https://github.com/MichaelGloessl04/wpapihandler/blob/e0b843b/index.ts#L21)

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

[index.ts:171](https://github.com/MichaelGloessl04/wpapihandler/blob/e0b843b/index.ts#L171)

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

[index.ts:230](https://github.com/MichaelGloessl04/wpapihandler/blob/e0b843b/index.ts#L230)

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

[index.ts:201](https://github.com/MichaelGloessl04/wpapihandler/blob/e0b843b/index.ts#L201)

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

[index.ts:80](https://github.com/MichaelGloessl04/wpapihandler/blob/e0b843b/index.ts#L80)

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

[index.ts:120](https://github.com/MichaelGloessl04/wpapihandler/blob/e0b843b/index.ts#L120)

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

[index.ts:64](https://github.com/MichaelGloessl04/wpapihandler/blob/e0b843b/index.ts#L64)
