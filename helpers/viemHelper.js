const { defineChain } = require('viem');
const sonicTestnet = defineChain({
  id: 64165,
  name: 'Sonic Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.soniclabs.com']
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://testnet.soniclabs.com/' },
  }
});