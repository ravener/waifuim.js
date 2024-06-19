# Waifu.im API

[Waifu.im](https://waifu.im) API Client for JavaScript.

Currently up to date as of API v6.

## Install

* Requires at least Node.js v18. Version 21+ recommended.
* This module relies on the Node.js native [`fetch()`](https://nodejs.org/docs/latest-v22.x/api/globals.html#fetch)
* This module is [ESM Only](https://nodejs.org/api/esm.html)

```sh
$ npm install waifuim
```

## Usage

```js
import { WaifuClient } from 'waifuim';

const token = 'API TOKEN';
const client = new WaifuClient({ token });

const images = await client.search({
    included_tags: ['waifu']
});

console.log(images);
```
