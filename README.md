<h1 align="center">
Maker Governance Dashboard
</h1>

<h3 align="center">
The Primary Interface for Dai Credit System Governance
</h3>

[![GitHub License][license]][license-url]
[![Build Status][build]][build-url]
[![Coverage Status][cover]][cover-url]

[Internal governance resources](https://makerdao.atlassian.net/wiki/spaces/MGV/pages/776667137/MCD+Governance+Resources)

### Getting started

Install project dependencies

```
yarn
```

## Running the Gov Dashboard

For development

```
yarn start
```

For production

```
yarn build
```

## Running Tests

```
yarn test
```

## Configuring the Backend

By default the production backend ([`content.makerfoundation.com`](https://content.makerfoundation.com)) will be used, but you can also set the `REACT_APP_GOV_BACKEND` environment variable to one of the following to override this:

- `local`: uses a local dev copy of the backend (`127.0.0.1:3000`)
- `staging`: uses the staging backend (`elb.content.makerfoundation.com:444`)
- `mock`: uses the mocked backend (see [`/src/_mock/topics.js`](/src/_mock/topics.js))

## Dogfooding

This project takes advantage of several other maker projects, including [maker ui components](https://github.com/makerdao/ui-components), [dai.js](https://github.com/makerdao/dai.js), & [the dai governance pulgin](https://github.com/makerdao/dai-plugin-governance).

## Code Style

We run Prettier on-commit, which means you can write code in whatever style you want and it will be automatically formatted according to the common style when you run `git commit`.

**The Maker Governance Dashboard** is available under the MIT license included with the code.

[license]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/makerdao/governance-dashboard.js/blob/master/LICENSE

[build]: https://travis-ci.com/makerdao/governance-dashboard.svg?token=7qKLu97qQDDMKfaxt318&branch=master
[build-url]: https://travis-ci.com/makerdao/governance-dashboard

[cover]: https://codecov.io/gh/makerdao/governance-dashboard/branch/master/graph/badge.svg?token=dYGCyaCdNA
[cover-url]: https://codecov.io/gh/makerdao/governance-dashboard