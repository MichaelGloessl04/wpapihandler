[wpapihandler](../README.md) / [Exports](../modules.md) / HeaderError

# Class: HeaderError

## Hierarchy

- `Error`

  ↳ **`HeaderError`**

## Table of contents

### Constructors

- [constructor](HeaderError.md#constructor)

### Properties

- [message](HeaderError.md#message)
- [name](HeaderError.md#name)
- [stack](HeaderError.md#stack)
- [prepareStackTrace](HeaderError.md#preparestacktrace)
- [stackTraceLimit](HeaderError.md#stacktracelimit)

### Methods

- [captureStackTrace](HeaderError.md#capturestacktrace)

## Constructors

### constructor

• **new HeaderError**(`message`): [`HeaderError`](HeaderError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

[`HeaderError`](HeaderError.md)

#### Overrides

Error.constructor

#### Defined in

src/errors/errors.ts:9

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
