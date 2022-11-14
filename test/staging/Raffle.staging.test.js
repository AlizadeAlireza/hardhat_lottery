const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
const { developmentChain, networkConfig } = require("../../helper-hardhat-config")

describe("Raffle Staging Tests", function () {
    let raffle, raffleEntranceFee, deployer
    const chainId = network.config.chainId

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        raffle = await ethers.getContract("Raffle", deployer)
        raffleEntranceFee = await raffle.getEntranceFee()
    })

    describe("fulfillRandomWords", function () {
        it("works with live Chainlink keepers and chainlink VRF, we get a random winner", async function () {
            // enter the raffle
            const startingTimeStamp = await raffle.getLatestStartTime()
            const accounts = await ethers.getSigners()

            await new Promise(async (resolve, reject) => {
                raffle.once("WinnerPicked", async () => {
                    console.log("WinnerPicked event fired! ")
                    try {
                        // add our asserts here
                        const recentWinner = await raffle.getRecentWinner()
                        const raffleState = await raffle.getRaffleState()
                        const winnerEndingBalance = await accounts[0].getBalance()
                        const endingTimeStamp = await raffle.getLatestTimeStamp()

                        // expect to reset
                        await expect(raffle.getPlayer(0)).to.be.reverted // not even going to be an object at zero
                        assert.equal(recentWinner.toString(), accounts[0].address)
                        assert.equal(raffleState, 0) // enum to open after we done

                        // want to make sure that the money has been transferred
                        assert.equal(
                            winnerEndingBalance.toString(),
                            winnerStartingBalance.add(raffleEntranceFee).toString()
                        )
                        assert(endingTimeStamp > startingTimeStamp)
                        resolve()
                    } catch (error) {
                        console.log(error)
                        reject(e)
                    }
                })
                // then entering the raffle
                await raffle.enterRaffle({ value: raffleEntranceFee })
                const winnerStartingBalance = await accounts[0].getBalance()

                // and this code WONT complete until our listener has finished listening!
            })
        })
    })
})
