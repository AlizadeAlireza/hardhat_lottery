const { network, ethers } = require("hardhat")

const BASE_FEE = ethers.utils.parseEther("0.25") // "250000000000000000"
const GAS_PRICE_LINK = 1e9
const args = [BASE_FEE, GAS_PRICE_LINK]
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChain.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        // deploy mock vrfCoordinatorV2
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        log("Mocks Deployed!!")
        log("_______________________________________")
    }
}

module.exports.tags = ["mocks", "all"]
