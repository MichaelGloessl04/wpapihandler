[wpapihandler](../README.md) / [Modules](../modules.md) / [errors/errors](../modules/errors_errors.md) / HeaderError

# Class: HeaderError

[errors/errors](../modules/errors_errors.md).HeaderError

## Hierarchy

- `Error`

  ↳ **`HeaderError`**

## Table of contents

### Constructors

- [constructor](errors_errors.HeaderError.md#constructor)

### Properties

- [message](errors_errors.HeaderError.md#message)
- [name](errors_errors.HeaderError.md#name)
- [stack](errors_errors.HeaderError.md#stack)
- [prepareStackTrace](errors_errors.HeaderError.md#preparestacktrace)
- [stackTraceLimit](errors_errors.HeaderError.md#stacktracelimit)

### Methods

- [captureStackTrace](errors_errors.HeaderError.md#capturestacktrace)

## Constructors

### constructor

• **new HeaderError**(`message`): [`HeaderError`](errors_errors.HeaderError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

[`HeaderError`](errors_errors.HeaderError.md)

#### Overrides

Error.constructor

#### Defined in

[errors/errors.ts:9](https://github.com/MichaelGloessl04/wpapihandler/blob/51f079e/errors/errors.ts#L9)

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/.pnpm/typescript@5.3.2/node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/.pnpm/typescript@5.3.2/node_modules/typescript/lib/lib.es5.d.ts:1075

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/.pnpm/typescript@5.3.2/node_modules/typescript/lib/lib.es5.d.ts:1077

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.10.4/node_modules/@types/node/globals.d.ts:28

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.10.4/node_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.10.4/node_modules/@types/node/globals.d.ts:21
