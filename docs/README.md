wpapihandler / [Exports](modules.md)

# Project Name

[![npm version](https://badge.fury.io/js/your-package-name.svg)](https://www.npmjs.com/package/your-package-name)
[![Build Status](https://travis-ci.com/yourusername/your-repo.svg?branch=master)](https://travis-ci.com/yourusername/your-repo)

Short project description.

## Installation

```sh
npm install your-package-name
```

# Usage
```ts
import WPApiHandler from './index';

const server_address = 'https://example.com';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
};

const wpApiHandler = new WPApiHandler(server_address, headers);

// Fetch the total number of posts
wpApiHandler.post_len().then(totalPosts => {
  console.log(`Total posts: ${totalPosts}`);
}).catch(error => {
  console.error('Error fetching data:', error);
});
```

# Documentation
For more detailed documentation, please refer to [the official documentation](./docs/modules.md).

# Changelog
See the [CHANGELOG.md](./CHANGELOG.md) for current version changes.

# Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

# License
This project is licensed under the MIT License - see the LICENSE.md file for details.
