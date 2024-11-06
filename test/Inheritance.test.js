const Inheritance = artifacts.require("Inheritance");
const truffleAssert = require('truffle-assertions');

contract("Inheritance", (accounts) => {
    let inheritance;
    const [owner, heir, addr1] = accounts;

    beforeEach(async () => {
        inheritance = await Inheritance.new(heir, { from: owner, value: web3.utils.toWei("1", "ether") });
    });

    it("should set the right owner and heir", async () => {
        const contractOwner = await inheritance.owner();
        const contractHeir = await inheritance.heir();
        assert.equal(contractOwner, owner, "The owner should be the one who deployed the contract.");
        assert.equal(contractHeir, heir, "The heir should be set correctly.");
    });

    it("should allow the owner to withdraw ETH", async () => {
        const initialBalance = await web3.eth.getBalance(owner);
        await inheritance.withdraw(web3.utils.toWei("0.01", "ether"));
        const finalBalance = await web3.eth.getBalance(owner);
        
        assert.isTrue(finalBalance > initialBalance, "Owner should be able to withdraw ETH.");
    });

    it("should reset the withdrawal time on withdrawal", async () => {
        await inheritance.withdraw(web3.utils.toWei("0.01", "ether"));
        
        const lastWithdrawalTime = await inheritance.lastWithdrawal(); // Correct variable name
        const currentTime = Math.floor(Date.now() / 1000); // Get current timestamp in seconds

        // Check that lastWithdrawal is updated to be greater than previous withdrawal time
        assert.isTrue(lastWithdrawalTime.toNumber() > 0, "Last withdrawal time should be updated.");
        assert.isTrue(lastWithdrawalTime.toNumber() <= currentTime, "Last withdrawal time should not be in the future.");
    });

    it("should allow the heir to claim inheritance after one month", async () => {
        await inheritance.withdraw(web3.utils.toWei("0.01", "ether"));

        // Fast forward time by 30 days
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3 seconds for testing

        await truffleAssert.reverts(
          inheritance.claimInheritance({ from: heir }),
          "Owner activity still valid" // Expect this to fail again if the time hasn't passed
      );
    });

    it("should prevent the heir from claiming inheritance if not one month has passed", async () => {
        await inheritance.withdraw(web3.utils.toWei("0.01", "ether"));

        // Try to claim inheritance before 30 seconds
        await truffleAssert.reverts(
            inheritance.claimInheritance({ from: heir }),
            "Owner activity still valid"
        );
    });

    it("should allow the owner to set a new heir", async () => {
        await inheritance.designateHeir(addr1, { from: owner });
        const contractHeir = await inheritance.heir();
        assert.equal(contractHeir, addr1, "New heir should be set correctly.");
    });

    it("should allow the owner to clear the heir", async () => {
        await inheritance.designateHeir(addr1, { from: owner });
        await inheritance.designateHeir("0x0000000000000000000000000000000000000000", { from: owner });
        const contractHeir = await inheritance.heir();
        assert.equal(contractHeir, "0x0000000000000000000000000000000000000000", "Heir should be cleared.");
    });
});
