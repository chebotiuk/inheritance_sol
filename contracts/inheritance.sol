// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Inheritance {
    address public owner;
    address public heir;
    uint256 public lastWithdrawal;

    uint256 constant TIME_LIMIT = 30 days;

    event Withdrawal(address indexed by, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier onlyHeir() {
        require(msg.sender == heir, "Not the designated heir");
        _;
    }

    constructor(address _heir) payable {
        owner = msg.sender; // Set the owner to the deployer
        heir = _heir; // Set the heir to the provided address
        lastWithdrawal = block.timestamp; // Initialize last withdrawal time
    }

    function withdraw(uint256 amount) external onlyOwner {
        // If the owner requests to withdraw 0 ETH
        if (amount == 0) {
            // Reset the last withdrawal time
            lastWithdrawal = block.timestamp;
        } else {
            require(address(this).balance >= amount, "Insufficient balance"); // Check for sufficient balance
            
            // Transfer the specified amount to the owner
            payable(owner).transfer(amount);
        }

        emit Withdrawal(owner, amount);
    }

    // Allows the heir to take control if the owner hasn't withdrawn for over 30 days
    function claimInheritance() external onlyHeir {
        require(block.timestamp >= lastWithdrawal + TIME_LIMIT, "Owner activity still valid"); // Check if 30 days have passed

        emit OwnershipTransferred(owner, heir);

        owner = heir; // Transfer ownership to the heir
        lastWithdrawal = block.timestamp; // Reset last withdrawal time
        heir = address(0); // Optionally clear the heir designation
    }

    // Allows the current owner to designate a new heir
    function designateHeir(address newHeir) external onlyOwner {
        heir = newHeir; // Set the new heir
    }

    // Fallback function to receive ETH
    receive() external payable {}
}
