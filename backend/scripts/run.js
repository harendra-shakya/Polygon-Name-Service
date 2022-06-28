const { ethers } = require("hardhat");

async function run() {
    const { deployer, player } = await hre.getNamedAccounts();
    const PNS = await ethers.getContract("PNS");
    const tx = await PNS.register("harendra", { value: ethers.utils.parseEther("0.2") });
    await tx.wait(1);
    const name = await await PNS.getAddress("harendra");
    console.log("Address:", name);

    await PNS.setRecord("harendra", "Haha I'm the owner");
    const record = await PNS.getRecord("harendra");
    console.log("Records", record);

    const price = await PNS.getPrice("harendra");
    console.log("Price is", ethers.utils.formatEther(price));

    const balance = await ethers.provider.getBalance(PNS.address);
    console.log("Contract Balance before withdraw:", ethers.utils.formatEther(balance));

    const ownerBalance = await ethers.provider.getBalance(deployer);
    console.log("Balance of owner", ethers.utils.formatEther(ownerBalance));

    // await PNS.withdraw({ player });
    // await PNS.withdraw();
    // console.log("withdraw happen");

    // const afterOwnerBalance = await ethers.provider.getBalance(deployer);
    // console.log("Balance of owner", ethers.utils.formatEther(afterOwnerBalance));
}

run()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
