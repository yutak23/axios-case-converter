# simple-axios-case-converter

[![npm](https://img.shields.io/npm/v/simple-axios-case-converter.svg)](https://www.npmjs.com/package/simple-axios-case-converter)
[![test](https://github.com/yutak23/simple-axios-case-converter/actions/workflows/test.yaml/badge.svg)](https://github.com/yutak23/simple-axios-case-converter/actions/workflows/test.yaml)
![style](https://img.shields.io/badge/code%20style-airbnb-ff5a5f.svg)

Axios request/response object key case converts _snake_case/camelCase_.

## Problem 😕

In many cases, the API's naming convention differs from JavaScript/TypeScript's(ex API is snake_case, JavaScript/TypeScript is camelCase), which means developers need to convert the case of variables and functions.

## Solution 😄

This library makes it easy for developers to convert case.

Features:

- Converts axios request `data` `params` object keys into _snake_case_
- Converts axios response `data` object keys into _camelCase_

With this library, you will be free from converting from camelCase to snake_case when making a request, and from converting from snake_case to camelCase in a response.

## Installation

### npm

```sh
$ npm install simple-axios-case-converter
```

### yarn

```sh
$ yarn add simple-axios-case-converter
```

## Usage

### TypeScript

```ts
import axios, { AxiosResponse } from 'axios';
import axiosCaseConverter from 'simple-axios-case-converter';

interface User {
	id: number;
	firstName: string;
	lastName: string;
	fullName: string;
}

// setting simple axios case converter
axiosCaseConverter(axios);

const res: AxiosResponse<User> = await axios.get('https://example.com/api/v1/me');
// you need not convert response `data` to camelCase (typeof res.data is `User`)
console.log(res.data);

// you need not convert request `params` to snake_case
axios.get('https://example.com/api/v1/todos', { params: { onlyComplete: true } });

// you need not convert request `data` to snake_case
axios.post('https://example.com/api/v1/address', {
	countryCode: 'JP',
	postalCode: '123-4567',
	prefecture: 'Tokyo',
	city: 'Shibuya'
});

// you need not convert request `data` to snake_case
axios.patch('https://example.com/api/v1/address/123', { postalCode: '123-4567' });

// you need not convert request `data` to snake_case
axios.delete('https://example.com/api/v1/address/123', { data: { addressId: 123 } });
```

### JavaScript

#### ES Module

```js
import axios from 'axios';
import axiosCaseConverter from 'simple-axios-case-converter';

// setting simple axios case converter
axiosCaseConverter(axios);

const res = await axios.get('https://example.com/api/v1/me');
// you need not convert response `data` to camelCase
console.log(res.data);

// you need not convert request `params` to snake_case
axios.get('https://example.com/api/v1/todos', { params: { onlyComplete: true } });

// you need not convert request `data` to snake_case
axios.post('https://example.com/api/v1/address', {
	countryCode: 'JP',
	postalCode: '123-4567',
	prefecture: 'Tokyo',
	city: 'Shibuya'
});

// you need not convert request `data` to snake_case
axios.patch('https://example.com/api/v1/address/123', { postalCode: '123-4567' });

// you need not convert request `data` to snake_case
axios.delete('https://example.com/api/v1/address/123', { data: { addressId: 123 } });
```

#### CommonJS

Note that you should be `require('...').default`.

```js
const axios = require('axios');
const axiosCaseConverter = require('simple-axios-case-converter').default;

// setting simple axios case converter
axiosCaseConverter(axios);

// after, the implementation is the same as the ES Module implementation
```

## API

`axiosCaseConverter: (axios, options)` -> `{ requestInterceptorId: number, responseInterceptorId: number }`

### options

_Optional_  
Type: `object`

#### requestExcludeKeys

_Optional_  
Type: `Array<string | RegExp>`

Exclude keys from being snake-cased at request `params` and `data`.

#### responseExcludeKeys

_Optional_  
Type: `Array<string | RegExp>`

Exclude keys from being camle-cased at response `data`.

## Note

### What is different from [axios-case-converter](https://www.npmjs.com/package/axios-case-converter)

There is a library, `axios-case-converter`, which provides similar functionality, but the differences from that library are as follows.

1. **Simple**  
   Various options can be specified for `axios-case-converter`, but that is also the flip side of complexity.  
   This library is very simple and simply converts request(`data`, `params`) and response(`data`) cases to _sanke_case/camelCase_.

1. **No side effects**  
   The `axios-case-converter` overrides [`axios.defaults`](https://github.com/axios/axios#config-defaults), which may cause unexpected side effects.  
   This library is simpler and safer because it uses the [`interceptor`](https://github.com/axios/axios#interceptors) and does not rewrite the default config.

1. **Easily remove the case conversion feature**  
    Since `axios-case-converter` overwrites `axios.defaults` (axios instance default config), if you want to remove `axios-case-converter` functionality, you need to update `axios.defaults` again and will have a hard time.  
    Since this library uses `interceptor`, you can easily disable the functionality of this library by `eject` as follows.
   ```ts
   const { requestInterceptorId, responseInterceptorId } = axiosCaseConverter(axios);
   axios.interceptors.request.eject(requestInterceptorId);
   axios.interceptors.response.eject(responseInterceptorId);
   ```

## License

[MIT licensed](./LICENSE)
