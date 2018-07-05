### Accounts available

```js
<div style={{ display: "flex", justifyContent: "space-around" }}>
  <AccountBox
    accounts={[
      { address: "0x8370148372a08b8908", type: "MetaMask" },
      { address: "0x8193704982a089cca8", type: "Ledger" }
    ]}
    web3Available={true}
  />
  <AccountBox
    accounts={[
      { address: "0x8370148372a08b8908", type: "MetaMask" },
      { address: "0x8193704982a089cca8", type: "Ledger" }
    ]}
    web3Available={true}
    dark={true}
  />
</div>
```

### No Accounts

```js
<div style={{ display: "flex", justifyContent: "space-around" }}>
  <AccountBox accounts={[]} web3Available={true} />
  <AccountBox accounts={[]} web3Available={true} dark={true} />
</div>
```
