require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()
require("./tasks/block-number")
require("./tasks/accounts")

const GOERLI_RPC_URL =
    process.env.GOERLI_RPC_URL ||
    "https://eth-goerli.g.alchemy.com/v2/kSi2Cik6bqBVH1YPTNNpxNNFvXhxFgBq"
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
    defaultNetwork: "localhost",
    solidity: {
        version: "0.8.7",
    },
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
        },
        hardhat: {
            chainId: 31337,
            // blockConfirmations: 1,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    paths: {
        tests: "./test/unit",
    },
    mocha: {
        timeout: 300000, // 200 seconds max
    },
}
