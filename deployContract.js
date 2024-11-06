// deploy.js
require("dotenv").config();
const { ethers, JsonRpcProvider } = require("ethers");
const compiledJson = require("./build/contracts/Inheritance.json"); // Ensure the correct casing in the file name

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const HEIR_ADDRESS = process.env.HEIR_ADDRESS;
const INFURA_URL = process.env.INFURA_URL;  // Your Infura project ID

async function main() {
  // Connect to the Sepolia testnet
  const provider = new JsonRpcProvider(INFURA_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Create a contract factory
  const factory = new ethers.ContractFactory(compiledJson.abi, compiledJson.bytecode, wallet);

  const heirAddress = HEIR_ADDRESS;

  // Deploy the contract with initial funding (optional, replace '1' with desired ether amount)
  const contract = await factory.deploy(heirAddress, { value: ethers.parseEther('0.01') });

  console.log("Response:", contract);
  console.log("Contract deployed at address:", contract.address); // Corrected from `contract.target`
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
