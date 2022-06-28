const { ethers, network } = require("hardhat");
const fs = require("fs");

const abiFileLocation = "../frontend/constants/";
const contractAddressesFileLocation = "../frontend/constants/contractAddresses.json";

module.exports = async function () {
    console.log("Updating frontend....");
    await updateAbi();
    await updateContractAddresses();
    console.log("Frontend updated!");
};

async function updateAbi() {
    const PNS = await ethers.getContract("PNS");
    fs.writeFileSync(
        `${abiFileLocation}pnsAbi.json`,
        PNS.interface.format(ethers.utils.FormatTypes.json)
    );
}

async function updateContractAddresses() {
    const PNS = await ethers.getContract("PNS");
    const chainId = network.config.chainId.toString();
    const contractAddresses = await JSON.parse(
        fs.readFileSync(contractAddressesFileLocation, "utf8")
    );
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["PNS"].includes(PNS.address)) {
            contractAddresses[chainId]["PNS"].push(PNS.address);
        }
    } else {
        contractAddresses[chainId] = { PNS: [PNS.address] };
    }
    fs.writeFileSync(contractAddressesFileLocation, JSON.stringify(contractAddresses));
}
