### Unlocked

```js
<div style={{ display: "flex", justifyContent: "space-around" }}>
  <AccountBox
    account="0x50104b8859824Ef71413D2f9d84EEa99c199CD12"
    web3Available={true}
  />
  <AccountBox
    account="0x50104b8859824Ef71413D2f9d84EEa99c199CD12"
    web3Available={true}
    dark={true}
  />
</div>
```

### Locked

```js
<div style={{ display: "flex", justifyContent: "space-around" }}>
  <AccountBox account="" web3Available={true} />
  <AccountBox account="" web3Available={true} dark={true} />
</div>
```

### Unavailable

```js
<div style={{ display: "flex", justifyContent: "space-around" }}>
  <AccountBox account="" web3Available={false} />
  <AccountBox account="" web3Available={false} dark={true} />
</div>
```
