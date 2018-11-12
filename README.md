<h1 align="center">
Maker Governance Dashboard
</h1>

<h3 align="center">
The Primary Interface for Dai Credit System Governance
</h3>




Live demo: https://dai-gov.now.sh/

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
- `staging`: uses the staging backend (`elb.content.makerfoundation.com:444`)
- `mock`: uses the mocked backend (see [`/src/_mock/topics.js`](/src/_mock/topics.js))

## Codebase

All calls to the [Ethereum](https://www.ethereum.org/) blockchain can be found in the `chain/` folder, split into "writes", "reads" and "web3 utils". These calls are generated from [redux thunks](https://github.com/reduxjs/redux-thunk) (where the results are used to update app-wide state) and sent via [infura](https://infura.io/) nodes (regardless of what provider is injected into the page). 

As for styling, we have css-in-js, & wherever possible, use official [maker ui components](https://github.com/makerdao/ui-components)

## Code Style

We run Prettier on-commit, which means you can write code in whatever style you want and it will be automatically formatted according to the common style when you run `git commit`.
