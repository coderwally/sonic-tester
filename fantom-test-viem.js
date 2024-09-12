const { createPublicClient, http, createWalletClient } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
require('dotenv').config();

const contractAddress = "0xe2107D1c08d957178C11c028dC58D1DE507C68A9";
const contractABI = require('./sonic-test-contract-abi.json');
const privateKey = `0x${process.env.PRIVATE_KEY}`;

const { fantomTestnet } = require('viem/chains');

const publicClient = createPublicClient({
    chain: fantomTestnet,
    transport: http(),
});

const walletClient = createWalletClient({
    chain: fantomTestnet,
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