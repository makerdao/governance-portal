# We Raised the Roof

![](https://cdn-images-1.medium.com/max/1600/1*I7AQj1FJ2AkyzuaaeLlwSg.png)

The launch of single-collateral Dai in December was a major milestone for Maker. This past weekend, MakerDAO achieved another very significant target: We reached the debt ceiling of 50 million Dai in circulation! With that, the new debt ceiling has increased to 100 million Dai.

The debt ceiling was originally set at 50 million so that the system could be stress-tested, allow for steady growth, and ensure that Dai remained as stable as possible until the launch of Multi-Collateral Dai at the end of Q3.

For the past six months we’ve seen encouraging adoption of Dai. The currency has held its stability against the USD and proved itself to be a stable and predictable unit of account. Additionally, our partners are working closely with us to integrate Dai which include: [Dether](https://medium.com/makerdao/makerdao-and-dether-partner-to-bring-stablecoin-dai-to-mobile-atms-around-the-world-d745fb9b3b9e) on bringing stable currencies to mobile ATMs, [Airswap](https://www.forbes.com/sites/rachelwolfson/2018/05/18/airswap-and-makerdao-form-collaborative-partnership-to-power-decentralized-crypto-marketplaces/#6e9555e6215e) on decentralized marketplaces and [Bifrost](https://bitcoinmagazine.com/articles/bifr%C3%B6st-new-blockchain-based-effort-deliver-foreign-aid-payments/) on foreign aid transactions. We’ve been watching (and celebrating) the adoption of Dai. With so much growth, we anticipated the debt ceiling would be soon reached. That’s why we’ve been working on the debt ceiling raise over the past few weeks.

In the last few days, we saw a spike in CDP creation, leading to the largest amount of Dai created in the shortest amount of time in history! A total of 7 Million Dai was drawn across a few CDPs representing a 16.27% increase in circulating Dai. This sudden influx led us to accelerate our plans to raise the debt ceiling.

### Raising the Debt Ceiling

To address increasing the debt ceiling, we held a governance vote to elect a new ‘authority’ over the system. This authority is a smart contract that had a function that could only be run once. As soon as this smart contract was voted as the new authority, we ran the function inside it, which raised the debt ceiling to 100,000,000 Dai.

We also used the function to add Oracle Security Modules (OSM) to the system. The intention for adding OSMs was to create another layer of security to our price feeds by delaying the prices for ETH/USD and MKR/USD by one hour, giving us time to react in the event the price feeds are compromised. After testing the system over the weekend, we made the decision to turn off OSM for ETH/USD, as we discovered it has a compatibility issue with the unique mechanics of single-collateral Dai. That said, the OSM for MKR/USD is still in effect.

We were able to test extensively during the upgrade process using our [open source tools](https://dapp.tools/): seth, dapp and hevm. This testing, combined with the recent results of a major audit from Bok Consulting, gave us the confidence that the process would work without a hitch.

![](https://cdn-images-1.medium.com/max/1600/0*cscr0DFawWAoMt6Z)

The new debt ceiling is an exciting proof-point of the adoption of Dai. We see it as a vote of confidence for Dai and validation for the only truly decentralized, currency that lives completely on the blockchain. We also believe it underscores the importance of a stable token whose stability is unmediated by any locality, and its solvency does not rely on any trusted counterparties.

We are still early in the Maker/Dai journey and there are many more milestones ahead as we work to unlock the power of the blockchain to drive economic empowerment for people around the globe. We are excited about the launch of Multi-Collateral Dai this summer. When Multi-Collateral Dai goes live, public voting will be enabled and we will have well-defined formal processes for all aspects of governance, including, among other things, a user-friendly voting tool, debating mechanisms, signalling and an easy way to view proposals. Another big milestone this summer is our inaugural governance vote on August 22.

As always, we encourage your participation in our community and look forward to the discussion.

### Learn More:

We believe in a future that leverages the power of decentralization for trustless transactions.

- Check out our [Website](https://makerdao.com/)
- Read our [Whitepaper](https://makerdao.com/whitepaper/DaiDec17WP.pdf)
- Join the conversation on [Reddit](https://www.reddit.com/r/MakerDAO/), [Twitter](http://twitter.com/makerdao), and [Telegram](https://t.me/makerdaoofficial)
