[wpapihandler](../README.md) / [Exports](../modules.md) / InvalidURLError

# Class: InvalidURLError

## Hierarchy

- `Error`

  ↳ **`InvalidURLError`**

## Table of contents

### Constructors

- [constructor](InvalidURLError.md#constructor)

### Properties

- [message](InvalidURLError.md#message)
- [name](InvalidURLError.md#name)
- [stack](InvalidURLError.md#stack)
- [prepareStackTrace](InvalidURLError.md#preparestacktrace)
- [stackTraceLimit](InvalidURLError.md#stacktracelimit)

### Methods

- [captureStackTrace](InvalidURLError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidURLError**(`message`): [`InvalidURLError`](InvalidURLError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

[`InvalidURLError`](InvalidURLError.md)

#### Overrides

Error.constructor

#### Defined in

src/errors/errors.ts:2

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
