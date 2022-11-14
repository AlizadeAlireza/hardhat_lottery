## lottery

for enterRaffle():

we can use require to enter in it. but ccustom errors store a lot more gas efficient
instead of storing a string message to revert.

    when we call this function we want to keep track of all the users actually
    enter our raffle.
    in this way we can pick the winner in the current raffle.
    so we can create an array of player and make it payable to pay the money to winner.

## Randomness in Web3:

much better to have 2 transactions.if just have one transaction,
then people could just brude manipulating the transaction.

so a func requested and the second func the random number to be returned.
and send the money to the winner.

requestRandomWinner() & fulfillRandomWords()

after import VRFConsumerBase we're going to need to make our raffle VRFconsumerBaseable.
we're to inherit it and

VRFcoordinator : the contract that does the random number verification.

we need to pass VRFcoordinator address in VRFConsumerBase constructor that we make.

we can import that and set it in a state variable.

VRFCoordinatorV2Interface parameters in the constructor:

    - keyHash : The gas lane key hash value.the max gas price we are willing to pay for a request.

    subscriptionId : we need the ID of the subscription that we're using to request our random numbers
    and pay the link Oracle gas.

    - requestConfirmation : how many confirmations the Chainlink node should wait before responding.
    The longer the node waits it's safer.
    set to a constant variable and use in interface.

    - callbackGasLimit : the limit for how much gas to use for the callback request to you contract's
    fullfillRandomWords() func.

    must be less than the maxGasLimit on the coordinator contract.

    for how much computation are fulfilled random words can be.
    is a good way to protect ourselves from spending way too much gas.

    - numWords : how many random numbers we want to get.

    this requestRandomWords func retruns a requestId and unique that defines whose requesting this
    and all this other information.

after we pick the winner and set the recent variable we make a function that anyone can see the winner.

after pick the winner we want to send them the money in this contract.

we don't have a way to actually keep track of the list of previous winners, so we're just going to
emit an event.
this can be a history of event winners.

## chainlink keeper :

in order to automate our contracts and and give them access to off chain computations.

there's two parts to building a chainlink keeper up kept smart contract.

    - first : we need to write a smart contract that's compatible by implementing these two methods.
    - second : we want to register that smart contract for upkeep with the chainlink keepr networks.

when the contract deployed and update interval, the contract is going to verify if has the enough time
updated the counter.

### chainlink compatible methods:

    - checkUpkeep():

        is special because this is where the off chain (run by a node) computation happens.
        if our check upkeep method returns, the upkeep is needed.
        then it's going to go ahead and perform upkeep onchain.
        compute off chain and pass it to func argument.

        basically going to be checking to see is it time for us
        to get a random number to update the recent winner and send them all the funds.

        we can generate data offchain and then pass that in checkData and that's become the performData.
        the checkData allows us to specify really anything that we want when we call this checkupkeep func().
        with type bytes, means that we can even specify this to call other functions.

        we only want checkup keep to work is if the lottery is actually open.

        if our all conditions passed, checkup keys will be true and will trigger
        the chain the keepers to request a new random winner.

        if enough time has passed, we're going to need to get the current:
            block.timestamp - last block.timestamp --> this must be greater that interval

        interval: how long we want to wait between lottery runs.

        the interval isn't going to change after we set it, so can be immutable.

        end we can check to see if enough time has passed with boolean.

        after we want to check we have enough player and balance --> at least one & some eth

        finally we're going take all these booleans and turn them into the return variable
        that we're looking for. ---> in upkeepNeeded

        performData is something that we can use if we want to have checkup, keep do
        some other stuff depending on how this checkup keep went.

        calldata doesn't work with the strings, so we using memory instead of calldata.

    - performUpkeep():

        the function executes after checkUpkeep() returns true, the chainlink nodes
        will automatically call this performeUpkeep() function.

        if in our checkUpkeep we have a perform data (argument) we would automatically
        pass it to our perfromData in performUpkeep() function.

        when it's time to pick a random winner, what we're going to do is
        just call the requestRandomFunction().

        in the UpkeepNotNeeded error we passing parameters to the error reciever know that
        why get this error.
            pass the balance of the contract, number of players, and the state situation.

        after this we need to reset our time stamp.

### enum in solidity and RaffleState:

1, after we declare this type and set into a variable, in our constructor we need to open up this raffle.

2, we want people to be able to enter if the lottery's open.

3, in request func we set calculating state for that so nobody enter our lottery and nobody can trigger
new update. because in req func the situation is on calculating.

### deploy with hardhat

we can get subscriptionId from vrf.chain.link but what about when we are on a localchain?
we can make a transaction that call and get a subscriptionId, and here an event can help us.

but for our test net we can use our networkConfig.

### unit TEST

if netwroks not local, skip.otherwise we'll do describe

constructor:
we want to make sure that when we start the raffle state is open.

    for interval we should get it from our helper-config

raffleEnter():
allow entrance when raffle is calculating:

    we want this raffle in the close state.in performUpkeep we move the raffle from open to calculating.
    but this func can only be called if check upkeep returns true.otherwise it will revert error.

    so we make checkUpkeep return true and we are in calculating state:
    1. we need to checkup keep to be true --> we are in open state.
    2. timepassed --> need to wait 30 second.

so we increase the time that everything interval is.

we pretend to be a chainlink keeper so we pass the empty calldata. --> blank array. --> []
now we are in calculating state.

checkUpkeep():

"returns false if people haven't sent any ETH"

for this we need every thing true except no body enter yet.

when we send [] to checkUpkeep because it is public trying to send a transaction but if
it was view it wouldn't.

we don't want to send a transaction but we can simulate sending this transaction
and seeing what this transaction needed would return.
with using ---> callstatic

callstatic will give us the return of upkeep needed and the bytes perform data.

so we set assert(!upkeepNeeded) because upkeepNeeded returns false so this will return true.

performUpkeep():

the emitted request id is availabte in the vrfcoordinator and is redundant in org contract.

fullfilRandomnessWord();

    - in this section of test we have another beforeEach.

    - we want to performupkeep witch is going to mock being chainlink keepers.
    witch will kickoff calling fulfill random words. -> mock being the chainlink VRF.

    - if we're doing this on a testnet after we call fulfill random words, we will have to wait for the fulfill
    randomwords to be called.
    but if we have work with hardhat local chain we don't need to wait for anything.

    - if we set up a listener we don't want this test finish before the listener has is done listening,
    so we need to once again create a new promise.

    we say raffle once emited WinnerPicked do some stuff and we add all thing
    in this function because we want to wait for winner to get picked.

    so we need call performUpkeep and fulfill random words.

    if we don't want to wait too much we can set a timeout in hardhat.config.
    if this event doesn't get fired in 200 seconds, this considered a failure and this test will fail.

    after we see who is the winner we can make sure that account got paied.

### staging test

in this test we shouldn't have to do anything else except for enter this raffle.
because the chainlink keepers and the VRF only going to be the ones to actually kickoff this lottery
for us.

we want to set up our listener first.]
only once we get this winner picked we can start doing our asserts.

once we get this winner picked event emmited, we're going to get that recent winner.

since we're only entering with our Deployer we should check to see the deployers balance at the
end.

we should get the starting Balance right after we enter.

the player enter the raffle, we check their starting balance right after enter.
and basically just get entranceFee back.
because they are the only ones who has enter the raffle.
