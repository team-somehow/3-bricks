# Three Bricks

### MetaMask Setup

1. Install Metamask

2. connect to polygon mumbai network. By clicking on the `Add Polygon Network` in the footer of [this site](https://mumbai.polygonscan.com/)

3. Request some matic from [Polygon Mumbai Faucet](https://faucet.polygon.technology/).

## Deploying smart contract

1. Create a new app on [alchemy](https://dashboard.alchemy.com/) select `chain` as `Polygon` and `network` as `Polygon Mumbai`.

2. Create a `.env` in the `/hardhat` folder

```
ALCHEMY_URL=alchemy_api_key_here
MATIC_PRIVATE_KEY=private_key_here
```

3. Deploy smart contract. In `/hardhat` run:

```bash
npx hardhat test
npm run deploy
```

4. Update contract address in `/frontend/src/constants/index.js`

```tsx
export const contractAddress = "0xaaaaaaaaaaaa";
```
