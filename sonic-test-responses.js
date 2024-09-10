const { ethers, JsonRpcProvider } = require("ethers");
const contractABI = require('./sonic-test-contract-abi.json');
const provider = new JsonRpcProvider('https://rpc.testnet.soniclabs.com');

require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
const contractAddress = "0x0b7488006Fd86857A2bf91a5A45d921a568279D4";

const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

provider.pollingInterval = 1; //ms

async function runLoop(count) {
  let durations = [];
  console.log(`*** Running loop ${count} transaction(s)...`);

  for (let i = 0; i < count; i++) {
    const startTimeTxn = Date.now();
    try {
      const tx = await contract.updateCounter(1, true);
      await tx.wait();
    } catch (error) {
    }    
    durations[i] = Date.now() - startTimeTxn;
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