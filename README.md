<h1 align="center">
Maker Governance Dashboard
</h1>

<h3 align="center">
The Primary Interface for Dai Credit System Governance
</h3>

Live demo version: https://dai-gov.now.sh/

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

1.  Install [dapptools](https://dapp.tools/)
1.  `yarn testnet`
1.  `yarn test`

## Configuring the Backend

By default the production backend ([`content.makerfoundation.com`](https://content.makerfoundation.com)) will be used, but you can also set the `REACT_APP_GOV_BACKEND` environment variable to one of the following to override this:

- `local`: uses a local dev copy of the backend (`127.0.0.1:3000`)
- `mock`: uses the mocked backend (see [`/src/_mock/topics.js`](/src/_mock/topics.js))

## Code Style

We run Prettier on-commit, which means you can write code in whatever style you want and it will be automatically formatted according to the common style when you run `git commit`.
