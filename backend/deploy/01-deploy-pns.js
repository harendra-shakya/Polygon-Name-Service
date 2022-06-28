const { verify } = require("../utils/verify");
const { network } = require("hardhat");
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    developmentChains,
} = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const waitConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;
    log("---------------------------------");
    const args = [".eth"];
    const PNS = await deploy("PNS", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: waitConfirmations,
    });
    log("Hurray! we deployed....");
    log("The contract address is", PNS.address);

    if (!developmentChains.includes(network.name)) {
        await verify(PNS.address, args);
        log("verified");
    }
};
