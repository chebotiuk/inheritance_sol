require('dotenv').config();
const { ethers, JsonRpcProvider } = require('ethers');
const yargs = require('yargs');

const compiledJson = require("./build/contracts/Inheritance.json");

// Connect to the Ethereum network
const provider = new JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract ABI and address
const contractABI = compiledJson.abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Function to call contract methods
async function callMethod(method, ...args) {
  try {
      let result;
      if (method === 'withdraw') {
          // Sending a transaction for withdraw
          const tx = await contract.withdraw(ethers.parseEther(args[0]));
          await tx.wait(); // Wait for the transaction to be mined
          if (args[0] == 0) {
            console.log(`Withdrawal of ${args[0]} ETH! Transaction hash: ${tx.hash}. lastWithdrawal value has been updated. New 30 days countdown has been initiated.`);
          } else {
            console.log(`Withdrawal of ${args[0]} ETH successful! Transaction hash: ${tx.hash}`);
          }
      } else if (method === 'claimInheritance') {
          const tx = await contract.claimInheritance();
          await tx.wait();
          console.log(`Inheritance claimed! Transaction hash: ${tx.hash}`);
      } else if (method === 'designateHeir') {
          const tx = await contract.designateHeir(args[0]);
          await tx.wait();
          console.log(`Heir designated to ${args[0]}! Transaction hash: ${tx.hash}`);
      } else if (method === 'owner') {
          // Reading data
          result = await contract.owner();
          console.log(`Current owner: ${result}`);
      } else if (method === 'heir') {
          result = await contract.heir();
          console.log(`Current heir: ${result}`);
      } else if (method === 'lastWithdrawal') {
          result = await contract.lastWithdrawal();
          console.log(`Current lastWithdrawal time is: ${result}`);
      } else {
          console.log('Method not recognized.');
          return;
      }
      
      if (result) {
          console.log(`Result: ${result}`);
      }
  } catch (error) {
      // Improved error handling
      if (error.code === 'CALL_EXCEPTION') {
          console.error('Transaction failed. Possible reasons:');
          console.error('- Insufficient balance in the contract for withdrawal.');
          console.error('- The owner has recently made a withdrawal; the heir cannot claim inheritance yet.');
          console.error('- Invalid arguments provided.');
      }
      console.error('Error calling method:', error.message);
  }
}

// CLI setup using yargs
yargs
    .command(
        'call <method> [args..]',
        'Call a method on the smart contract',
        (yargs) => {
            yargs
                .positional('method', {
                    describe: 'Method to call',
                    type: 'string',
                    choices: ['withdraw', 'claimInheritance', 'designateHeir', 'owner', 'heir', 'lastWithdrawal'],
                })
                .positional('args', {
                    describe: 'Arguments for the method',
                    type: 'string',
                });
        },
        (argv) => {
            const { method, args } = argv;
            callMethod(method, ...args);
        }
    )
    .help()
    .argv;
