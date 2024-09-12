const { createPublicClient, http, createWalletClient } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
require('dotenv').config();

const contractAddress = "0x0b7488006Fd86857A2bf91a5A45d921a568279D4";
const contractABI = require('./sonic-test-contract-abi.json');
const privateKey = `0x${process.env.PRIVATE_KEY}`;



//const { defineChain } = require('viem');
const sonicTestnet = require('./helpers/viemHelper.js');
 
// const sonicTestnet = defineChain({
//   id: 64165,
//   name: 'Sonic Testnet',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Sonic',
//     symbol: 'S',
//   },
//   rpcUrls: {
//     default: {
//       http: [rpcUrl]
//     },
//   },
//   blockExplorers: {
//     default: { name: 'Explorer', url: 'https://testnet.soniclabs.com/' },
//   }
// });



const publicClient = createPublicClient({
    chain: sonicTestnet,
    transport: http(),
});

const walletClient = createWalletClient({
    chain: sonicTestnet,
    transport: http(),
});

const account = privateKeyToAccount(privateKey);

async function getTotalCount() {
  const data = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getTotalCount',
  });

  console.log(data);
}

async function updateCounter() {
  const data = await walletClient.writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'updateCounter',
    args: [1, true],
    account,
  });
}

async function runLoop(count) {
  let durations = [];
  console.log(`*** Running loop ${count} transaction(s)...`);

  for (let i = 0; i < count; i++) {
    const startTimeTxn = Date.now();
    try {
      await updateCounter();
    } catch (error) {
      console.log(error);
    }    
    durations[i] = Date.now() - startTimeTxn;

    //delay needed to prevent viem transactions being too close together and giving nonce error
    //delay is outside of duration calculation, so doesn't influence the results
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  const durationsSum = durations.reduce((a, b) => a + b, 0);
  console.log('*** Loop completed in ' + durationsSum + 'ms - Average per txn: ' + Math.ceil(durationsSum / count) + 'ms');
}

async function runOperations() {
  await runLoop(1, true);
  await runLoop(3, true);
  await runLoop(10, true);
  await runLoop(20, true);
}

runOperations();