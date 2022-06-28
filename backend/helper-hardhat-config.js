const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    4: {
        name: "rinkeby",
        gasPrice: "10000000007",
        gasLimit: "50000000000",
    },
    80001: {
        name: "mumbai",
        gasPrice: "10000000007",
        gasLimit: "50000000000",
    },
    3: {
        name: "ropsten",
        gasPrice: "10000000007",
        gasLimit: "50000000000",
    },
    1: {
        name: "mainnet",
    },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
};
