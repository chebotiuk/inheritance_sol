# Inheritance Smart Contract

A Solidity smart contract for managing inheritance on the Ethereum blockchain. This contract allows an owner to designate an heir and withdraw funds, with additional functionality allowing the heir to claim the inheritance if the owner has been inactive for a set period.

## Table of Contents

- [Overview](#overview)
- [Smart Contract Details](#smart-contract-details)
- [Methods](#methods)
- [Deployment](#deployment)
- [Testing](#testing)
- [Usage](#usage)
- [Example CLI Interaction](#example-cli-interaction)

---

## Overview

The **Inheritance** contract is designed to handle inheritance in a trustless manner on the Ethereum blockchain. The contract owner can withdraw funds and set a designated heir. If the owner is inactive for over 30 days, the heir can claim the contract's funds and ownership.

## Smart Contract Details

- **Solidity Version**: ^0.8.0
- **Network**: Ethereum
- **License**: MIT
- **Contract Address**: (Deploy to get address)

The contract allows:
- Owner to withdraw funds and reset the inactivity timer.
- Owner to designate an heir.
- Heir to claim inheritance if the owner is inactive for over 30 days.

---

## Methods

### `constructor(address _heir)`
Deploys the contract with the specified heir address and sets the contract's initial balance.

### `withdraw(uint256 amount)`
Allows the owner to withdraw Ether from the contract. If `amount` is zero, the timer is reset without withdrawal.

- **Parameters**: `amount` (in wei)
- **Permissions**: Owner-only

### `claimInheritance()`
Allows the designated heir to claim inheritance if the owner has been inactive for over 30 days.

- **Permissions**: Heir-only
- **Conditions**: Must be called after 30 days of owner inactivity.

### `designateHeir(address newHeir)`
Allows the owner to set a new heir.

- **Parameters**: `newHeir` - Address of the new heir
- **Permissions**: Owner-only

### `receive() external payable`
Allows the contract to receive Ether directly.

---

## Deployment

To deploy this contract, follow these steps:

1. **Compile** the contract using a Solidity compiler, such as [Remix](https://remix.ethereum.org/) or Truffle.
2. **Deploy** the contract on Ethereum via Remix, Hardhat, or Truffle.
3. **Set the Heir Address** in the deployment arguments.

---

## Testing

This project uses `Truffle` for testing. 

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Truffle](https://trufflesuite.com/docs/truffle/getting-started/installation)
- [Ganache](https://trufflesuite.com/ganache/) (optional for local testing)

### Running Tests

1. Install dependencies:
   ```bash
   npm install
   ```

2. `truffle test`

## Usage

### Interacting with the Contract

To interact with this contract, you can use libraries such as [ethers.js](https://docs.ethers.io/) or [web3.js](https://web3js.readthedocs.io/) in a Node.js environment, or interact directly in Remix.

### CLI Tool for Contract Interaction

A CLI tool is included for easy interaction with the contract. Follow the steps below to use the CLI tool.

#### Installation

1. **Install Dependencies**:
   ```bash
   npm install ethers dotenv
   ```

2. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with the following variables:
   ```dotenv
   INFURA_PROJECT_ID=<Your Infura Project ID>
   PRIVATE_KEY=<Your Wallet Private Key>
   CONTRACT_ADDRESS=<Deployed Contract Address>
   ```

#### CLI Commands

The following commands allow you to interact with the contract:

- **Withdraw Funds**:
  Withdraws a specified amount of Ether from the contract.

  ```bash
  node cli.js withdraw <amount_in_ether>
  ```

  Example:
  ```bash
  node cli.js withdraw 0.1
  ```

- **Claim Inheritance**:
  Allows the designated heir to claim inheritance if the owner has been inactive for 30 days.

  ```bash
  node cli.js claim
  ```

  Example:
  ```bash
  node cli.js claim
  ```

- **Designate a New Heir**:
  Sets a new heir for the inheritance.

  ```bash
  node cli.js designate <new_heir_address>
  ```

  Example:
  ```bash
  node cli.js designate 0xNewHeirAddress
  ```

These commands allow you to perform common actions directly from the command line, making it easier to interact with the contract without needing to write additional scripts.
